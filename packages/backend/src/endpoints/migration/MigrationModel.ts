/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path'
import Logger from '../../libs/Logger'
import { writeFile } from 'fs/promises'
import { EXPORT_DIRNAME } from '../../configs/constants'
import IAny from '../../libs/types/IAny'
import { Model, ModelStatic, UpdateOptions } from 'sequelize'
import API from '../API'
import { GModel } from '../../libs/types/ITimestamp'
import { BASE_PATH } from '../../common'
import { v4 as uuidv4 } from 'uuid' // Add this import

export interface IDoc {
  [name: string]: IAny[]
}

export interface IModels {
  [name: string]: ModelStatic<Model<any, any>>
}

export type IUpdatingOption = UpdateOptions

class MigrationModel {
  modelDir = resolve(__dirname, '..', 'models')
  models: IModels = {}

  private constructor() {}

  static async initModels(): Promise<MigrationModel> {
    const thiz = new this()
    await thiz.initModels()
    return thiz
  }

  private async initModels() {
    API.forEach((version) => {
      for (const controllerRoute of version.controllerRoutes) {
        try {
          const modelName = controllerRoute.model?.name?.split('Model')[0]
          if (controllerRoute.model && modelName) {
            this.models[modelName] = controllerRoute.model
          }
        } catch (error) {
          Logger.error(error)
        }
      }
    })
  }

  getModel(name: string) {
    name = name.split('Model')[0]
    return this.models[name]
  }

  async backup() {
    const backupPath = resolve(BASE_PATH, EXPORT_DIRNAME)
    const models = await this.getAll()
    for (const model of models) {
      const [name] = Object.keys(model)
      const modelString = JSON.stringify(model)
      await writeFile(`${backupPath}/${name}.json`, modelString)
    }
    return models
  }

  async getAll() {
    const models: any[] = []
    for (const [name, model] of Object.entries(this.models)) {
      try {
        const docs = await (<Promise<any>>model!.findAll())
        if (!docs) continue
        models.push({ [name]: docs })
      } catch (error) {
        Logger.error(error)
      }
    }
    return models
  }

  async create(modelDocs: IDoc[], updatingOption?: IUpdatingOption) {
    const updating = !!updatingOption
    let msg = ''

    for (const modelDoc of modelDocs) {
      const [name, docs] = Object.entries(modelDoc)[0]
      const model = this.getModel(name)
      if (!model) {
        msg += `Model ${name} not found\n`
        continue
      }
      for (const doc of docs) {
        try {
          if (updating) {
            const [updatedRows] = await model?.update(doc, {
              ...(updatingOption || {}),
              where: { _id: doc?._id },
            } as any)
            if (updatedRows === 0) {
              await model?.create(doc as any)
            }
          } else {
            await model?.create(doc as any)
          }
        } catch (error) {
          //Logger.error(error)
          msg += `${(error as any)?.message}\n\n`
        }
      }
      msg += `Docs ${updating ? 'update in' : 'add to'} ${name}\n`
    }
    return msg
  }

  async update(modelDocs: IDoc[], updatingOption?: IUpdatingOption) {
    return await this.create(modelDocs, updatingOption || ({} as any))
  }

  async delete(models?: []) {
    if (!models || models.length < 1) {
      for (const model of Object.values(this.models)) {
        await model.destroy()
      }
    } else {
      for (const modelName of models) {
        await this.getModel(modelName).destroy()
      }
    }
  }
}

export default MigrationModel
