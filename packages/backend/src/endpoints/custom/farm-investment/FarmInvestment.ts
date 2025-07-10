/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import IUser from '../../user/IUser'
import {
  NOT_FOUND,
  BAD_REQUEST,
  GET_SUCCESS,
  POST_SUCCESS,
  BAD_AUTHORIZATION,
} from '../../../configs/statusCodeConstants'
import PaginatingModel from '../../../libs/models/PaginatingModel'
import { getDefinedValuesFrom } from '../../../common'
import FileStore from '../../../libs/FileStore'
import { IFarmInvestment } from './IFarmInvestment'
import { PENDING_APPROVAL } from '../../../configs/constants'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import FarmInvestmentModel from './FarmInvestmentModel'
import FarmInvestmentRoutes from './FarmInvestmentRoutes'

class FarmInvestment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await FarmInvestmentModel.findByPk(_id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('FarmInvestment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const farmInvestment = await new PaginatingModel<IFarmInvestment>(FarmInvestmentModel, this).markPublic(true).exec()
    if (!farmInvestment) this.status(false).statusCode(NOT_FOUND).message('No FarmInvestments').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(farmInvestment).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const { description, pricePerUnit, minUnits, roi, closingDate, maturityDate, expenses } = this.req
      .body as IFarmInvestment

    const created = await FarmInvestmentModel.create({
      uid: this.user._id,
      description,
      pricePerUnit,
      minUnits,
      roi,
      closingDate,
      maturityDate,
      expenses,
      assets: assets || undefined,
      //status: PENDING_APPROVAL,
    })
    if (!created) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('Error creating FarmInvestment').send()
    } else {
      /* new Mailer()
        .setSubject('New Listed FarmInvestment')
        .addRecipient({ name: 'Support', address: SharedConfig.get('SUPPORT_EMAIL') })
        .setBody(
          `
        <h2>FarmInvestment Pending Approval</h2>
        <p>There is a newly listed investment kindly attend to it.</p>
        <p>FarmInvestment Name: ${name}</p>
        <p>Listed by: ${this.user?.firstname} ${this.user?.lastname}</p>
        <p>Date: ${new Date().toISOString()}</p>`,
          SharedConfig.get('SITE_URL') + FarmInvestmentRoutes.baseUrl,
        )
        .send() */
      this.status(true).statusCode(POST_SUCCESS).message('FarmInvestment created').setData(created).send()
    }
  }

  async update() {
    let assets
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = (await filestore.uploadForMultiple('assets')) || null
    }

    const { _id, description, pricePerUnit, minUnits, roi, closingDate, maturityDate, expenses, status } = this.req
      .body as IFarmInvestment

    const definedValues = getDefinedValuesFrom({
      description,
      pricePerUnit,
      minUnits,
      roi,
      closingDate,
      maturityDate,
      expenses,
      assets: assets || undefined,
      status,
    })
    const prev = (await FarmInvestmentModel.findByPk(_id))
    if (!(await this.ownerAndAdminAccess(prev?.uid!, false))) {
      assets?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    const [updatedCount, updatedRows] = await FarmInvestmentModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const updated = updatedRows[0]

    if (updated && assets && prev?.assets) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('FarmInvestment failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('FarmInvestment updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const deleted = (await FarmInvestmentModel.findOne({ where: { _id } }))
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('FarmInvestment failed to be deleted due to error').send()
    } else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      await FarmInvestmentModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('FarmInvestment deleted').setData(deleted).send()
    }
  }
}

export default FarmInvestment
