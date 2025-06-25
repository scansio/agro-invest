/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import PaginatingModel from '../../libs/models/PaginatingModel'
import NotFoundException from '../../exceptions/NotFoundException'
import { GET_SUCCESS, NOT_FOUND } from '../../configs/statusCodeConstants'
import AuthenticationException from '../../exceptions/AuthenticationException'
import BaseController from '../../libs/controller/BaseController'
import MigrationModel from '../migration/MigrationModel'

class DataStore extends BaseController {
  private _normalAccess

  set normalAccess(value: boolean) {
    if (this.directRequest) {
      throw new AuthenticationException(this, "You can't do that")
    }
    this._normalAccess = value
  }

  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
    this._normalAccess = false
  }

  async all({ store }: any) {
    if (!this._normalAccess) {
      await this.adminAccess()
    }
    if (!store) {
      throw new NotFoundException(this, 'Data Store not found')
    }
    let storeModel = (await MigrationModel.initModels()).getModel(store)
    const found = await new PaginatingModel<any>(storeModel, this).markPublic(true).exec()
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Store not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async count({ store }: any) {
    /* if (!this._normalAccess) {
      await this.adminAccess()
    } */
    if (!store) {
      throw new NotFoundException(this, 'Data Store not found')
    }
    let storeModel = (await MigrationModel.initModels()).getModel(store)
    const count = await new PaginatingModel<any>(storeModel, this).markPublic(true).setCountOnly(true).exec()

    this.status(true).statusCode(GET_SUCCESS).setData(count).send()
  }

  async sum({ store, field }: any) {
    if (!this._normalAccess) {
      await this.adminAccess()
    }
    let storeModel = (await MigrationModel.initModels()).getModel(store)
    const sum = await new PaginatingModel<any>(storeModel, this).markPublic(true).setSumField(field).exec()
    this.status(true).statusCode(GET_SUCCESS).setData(sum).send()
  }
}

export default DataStore
