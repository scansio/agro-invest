/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, FindOptions, Includeable, WhereOptions, Order, Op, Sequelize } from 'sequelize'
import { NORMAL_RETURNED_RESULT_SET, RESULT_SET_MAX } from '../../configs/constants'
import {
  decodeQuery,
  encodeQuery,
  escapeRegExp,
  getCurrentUrlWithoutQueryParams,
  getDayRegex,
  sumField,
} from '../../common'
import SharedConfig from '../SharedConfig'
import IPaginating from '../types/IPaginating'
import IPaginatingMetadata from '../types/IPaginatingMetadata'
import BaseController from '../controller/BaseController'
import ITimestamp, { GModel } from '../types/ITimestamp'

class PaginatingModel<T extends ITimestamp> {
  private model: typeof GModel<T>
  private controller: BaseController
  private parsedClientQuery: { [key: string]: any }
  private isPublic: boolean
  private countOnly: boolean
  private sumField: string
  private _uidKeys: (keyof T)[] | undefined = ['uid' as any]
  private options: FindOptions = {}

  constructor(clazz: typeof Model<T, any>, controller: BaseController, ignoreQuery = false) {
    this.model = clazz as typeof GModel<T>
    this.controller = controller
    this.isPublic = false
    this.countOnly = false
    this.sumField = ''
    const { q } = ignoreQuery ? {} : this.controller.req.query
    this.parsedClientQuery = !q ? {} : this.parsedQueryOptions(q as string)
  }

  count(): this {
    this.options.attributes = [[this.model.sequelize!.fn('COUNT', '*'), 'count']]
    return this
  }

  include(include: Includeable | Includeable[]): this {
    this.options.include = include
    return this
  }

  where(where: WhereOptions<T>): this {
    this.options.where = where
    return this
  }

  sort(order: Order): this {
    this.options.order = order
    return this
  }

  public markPublic(yes: boolean) {
    this.isPublic = yes
    return this
  }

  public setCountOnly(yes: boolean) {
    this.countOnly = yes
    return this
  }

  public setSumField(field: string) {
    this.sumField = field
    return this
  }

  public uidKey(key: (keyof T)[] | keyof T) {
    if (Array.isArray(key)) {
      this._uidKeys = key
    } else {
      this._uidKeys = [key]
    }
    return this
  }

  private parsedQueryOptions(): string
  private parsedQueryOptions(query: string): { [key: string]: any }
  private parsedQueryOptions(query: { [key: string]: any }): string
  private parsedQueryOptions(query?: { [key: string]: any } | string) {
    if (!query) {
      return this.parsedQueryOptions(this.parsedClientQuery)
    } else if (typeof query == 'string') {
      return decodeQuery(query)
    } else {
      return encodeQuery(query)
    }
  }

  private async setClientQueryOptions() {
    const DBQuery = { ...this.parsedClientQuery }
    if (!this.isPublic) {
      let userChecked = false
      for (const key of this._uidKeys || []) {
        const uid = DBQuery[key as string]
        if (uid) {
          await this.controller.ownerAndAdminAccess(uid)
          userChecked = true
          break
        }
      }
      if (!userChecked) {
        await this.controller.adminAccess()
      }
    }

    for (const pathName in DBQuery) {
      const pathValue = DBQuery[pathName]

      if (pathValue instanceof Object && !Array.isArray(pathValue)) {
        if (pathName === '$sort') {
          this.options.order = Object.entries(pathValue).map(([key, value]) => [key, value === 1 ? 'ASC' : 'DESC'])
          delete DBQuery[pathName]
        } else if (pathName === '$in') {
          for (const [key, values] of Object.entries(pathValue)) {
            DBQuery[key] = { [Op.in]: values }
          }
          delete DBQuery[pathName]
        } else if (pathName === '$nin') {
          for (const [key, values] of Object.entries(pathValue)) {
            DBQuery[key] = { [Op.notIn]: values }
          }
          delete DBQuery[pathName]
        } else if (pathName === '$or') {
          DBQuery[Op.or as any] = Object.entries(pathValue).map(([key, value]) => ({ [key]: value }))
          delete DBQuery[pathName]
        } else if (!(pathValue.$gt || pathValue.$gte || pathValue.$lt || pathValue.$lte)) {
          delete DBQuery[pathName]
        }
      } else if (pathName === 'createdAt' || pathName === 'updatedAt') {
        delete DBQuery[pathName];

        // Query the nested JSON field `dateString` inside `createdAt` or `updatedAt`
        DBQuery[Sequelize.json(`${pathName}.dateString`) as any] = {
          [Op.like]: `%${getDayRegex(pathValue)}%`,
        };
      } else if (pathName === 'populate') {
        if (Array.isArray(pathValue)) {
          this.options.include = pathValue.map((path) => {
            if (typeof path === 'string') {
              return { association: path }
            } else {
              const sortName = Object.keys(path.options.sort)[0]
              const sortOrder = Object.values(path.options.sort)[0]
              return {
                association: path.path,
                order: [[path.path, sortName, sortOrder === 1 ? 'ASC' : 'DESC']],
              }
            }
          })
        }
        delete DBQuery[pathName]
      } else if (typeof pathValue === 'string') {
        DBQuery[pathName] = {
          [Op.like]: `%${escapeRegExp(pathValue)}%`,
        }
      }
    }

    this.options.where = { ...this.options.where, ...DBQuery }
  }

  async exec(): Promise<IPaginating<T> | number> {
    await this.setClientQueryOptions()

    if (this.sumField) {
      const results = await this.model.findAll(this.options)
      const sum = sumField(results, this.sumField)
      return sum
    }

    const totalResults = await this.model.count({ where: this.options.where })
    if (this.countOnly) {
      return totalResults
    }

    const { page, size } = this.controller.req.query

    const parsed_page = Number.parseInt(`${page}`)
    const parsed_size = Number.parseInt(`${size}`)

    let t_page: number = isNaN(parsed_page) || parsed_page < 1 ? 1 : parsed_page

    const t_size: number = isNaN(parsed_size)
      ? SharedConfig.get('NORMAL_RETURNED_RESULT_SET') || NORMAL_RETURNED_RESULT_SET
      : parsed_size > (SharedConfig.get('RESULT_SET_MAX') || RESULT_SET_MAX)
      ? SharedConfig.get('RESULT_SET_MAX') || RESULT_SET_MAX
      : parsed_size

    let totalPages = Math.ceil(totalResults / t_size)
    totalPages < 1 && (totalPages = 1)

    while (t_size * t_page - t_size > totalResults && t_page > 1) {
      --t_page
    }

    const offset: number = totalPages == 1 ? 0 : t_size * t_page - t_size

    this.options.limit = t_size
    this.options.offset = offset

    const results: GModel<T>[] = await this.model.findAll(this.options)

    const metadata: IPaginatingMetadata = {
      totalPages,
      totalResults,
      resultCount: results.length,
      currentPage: t_page,
      size: t_size,
      nextUrl: `${getCurrentUrlWithoutQueryParams(this.controller.req)}?q=${this.parsedQueryOptions()}&page=${
        t_page + 1
      }&size=${t_size}`,
      previousUrl: `${getCurrentUrlWithoutQueryParams(this.controller.req)}?q=${this.parsedQueryOptions()}&page=${
        t_page - 1
      }&size=${t_size}`,
      hasNext: t_page + 1 <= totalPages,
      hasPrevious: t_page > 1,
      url: getCurrentUrlWithoutQueryParams(this.controller.req),
      query: this.parsedQueryOptions(),
      nextPage: t_page + 1,
      previousPage: t_page - 1,
    }

    const data: IPaginating<T> = {
      metadata,
      results,
    }
    return data
  }
}

export default PaginatingModel
