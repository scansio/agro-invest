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
import { IAnimalInvestment } from './IAnimalInvestment'
import { PENDING_APPROVAL } from '../../../configs/constants'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import AnimalInvestmentModel from './AnimalInvestmentModel'

class AnimalInvestment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await AnimalInvestmentModel.findByPk(_id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('AnimalInvestment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const animalInvestmentes = await new PaginatingModel<IAnimalInvestment>(AnimalInvestmentModel, this)
      .markPublic(true)
      .exec()
    if (!animalInvestmentes) this.status(false).statusCode(NOT_FOUND).message('No AnimalInvestmentes').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(animalInvestmentes).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const { name, description, pricePerUnit, minUnits, roi, closingDate, maturityDate, expenses } = this.req
      .body as IAnimalInvestment

    const created = await AnimalInvestmentModel.create({
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
      this.status(false).statusCode(BAD_REQUEST).message('Error creating AnimalInvestment').send()
    } else {
     /*  new Mailer()
        .setSubject('New Listed AnimalInvestment')
        .addRecipient({ name: 'Support', address: SharedConfig.get('SUPPORT_EMAIL') })
        .setBody(
          `
        <h2>AnimalInvestment Pending Approval</h2>
        <p>There is a newly listed investment kindly attend to it.</p>
        <p>AnimalInvestment Name: ${name}</p>
        <p>Listed by: ${this.user?.firstname} ${this.user?.lastname}</p>
        <p>Date: ${new Date().toISOString()}</p>`,
          SharedConfig.get('SITE_URL') + '/animalInvestment',
        )
        .send() */
      this.status(true).statusCode(POST_SUCCESS).message('AnimalInvestment created').setData(created).send()
    }
  }

  async update() {
    let assets
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = (await filestore.uploadForMultiple('assets')) || null
    }

    const { _id, name, description, pricePerUnit, minUnits, roi, closingDate, maturityDate, expenses, status } = this
      .req.body as IAnimalInvestment

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
    const prev = await AnimalInvestmentModel.findByPk(_id)
    if (!(await this.ownerAndAdminAccess(prev?.uid!, false))) {
      assets?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    const [updatedCount, updatedRows] = await AnimalInvestmentModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const updated = updatedRows[0]

    if (updated && assets && prev?.assets) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('AnimalInvestment failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('AnimalInvestment updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const deleted = await AnimalInvestmentModel.findOne({ where: { _id } })
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('AnimalInvestment failed to be deleted due to error').send()
    } else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      await AnimalInvestmentModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('AnimalInvestment deleted').setData(deleted).send()
    }
  }
}

export default AnimalInvestment
