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
import { ICropInvestment } from './ICropInvestment'
import { PENDING_APPROVAL } from '../../../configs/constants'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import CropInvestmentModel from './CropInvestmentModel'
import CropInvestmentRoutes from './CropInvestmentRoutes'

class CropInvestment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await CropInvestmentModel.findByPk(_id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('CropInvestment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const cropInvestmentes = await new PaginatingModel<ICropInvestment>(CropInvestmentModel, this)
      .markPublic(true)
      .exec()
    if (!cropInvestmentes) this.status(false).statusCode(NOT_FOUND).message('No CropInvestmentes').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(cropInvestmentes).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const {
      name,
      description,
      pricePerUnit: pricePerUnit,
      minUnits,
      roi,
      closingDate,
      maturityDate,
      expenses,
    } = this.req.body as ICropInvestment

    const created = await CropInvestmentModel.create({
      uid: this.user._id,
      name,
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
      this.status(false).statusCode(BAD_REQUEST).message('Error creating CropInvestment').send()
    } else {
      /* new Mailer()
        .setSubject('New Listed CropInvestment')
        .addRecipient({ name: 'Support', address: SharedConfig.get('SUPPORT_EMAIL') })
        .setBody(
          `
        <h2>CropInvestment Pending Approval</h2>
        <p>There is a newly listed nvestment kindly attend to it.</p>
        <p>CropInvestment Name: ${name}</p>
        <p>Listed by: ${this.user?.firstname} ${this.user?.lastname}</p>
        <p>Date: ${new Date().toISOString()}</p>`,
          SharedConfig.get('SITE_URL') + CropInvestmentRoutes.baseUrl,
        )
        .send() */
      this.status(true).statusCode(POST_SUCCESS).message('CropInvestment created').setData(created).send()
    }
  }

  async update() {
    let assets
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = (await filestore.uploadForMultiple('assets')) || null
    }

    const {
      _id,
      name,
      description,
      pricePerUnit: pricePerUnit,
      minUnits,
      roi,
      closingDate,
      maturityDate,
      expenses,
      status,
    } = this.req.body as ICropInvestment

    const definedValues = getDefinedValuesFrom({
      name,
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
    const prev = (await CropInvestmentModel.findByPk(_id))
    if (!(await this.ownerAndAdminAccess(prev?.uid!, false))) {
      assets?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    const [updatedCount, updatedRows] = await CropInvestmentModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const updated = updatedRows[0]

    if (updated && assets && prev?.assets) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('CropInvestment failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('CropInvestment updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const deleted = (await CropInvestmentModel.findOne({ where: { _id } }))
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('CropInvestment failed to be deleted due to error').send()
    } else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      await CropInvestmentModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('CropInvestment deleted').setData(deleted).send()
    }
  }
}

export default CropInvestment
