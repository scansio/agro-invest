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
import { IBusiness } from './IBusiness'
import { PENDING_APPROVAL } from '../../../configs/constants'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import BusinessModel from './BusinessModel'

class Business extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await BusinessModel.findByPk(_id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Business not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const businesses = await new PaginatingModel<IBusiness>(BusinessModel, this).markPublic(true).exec()
    if (!businesses) this.status(false).statusCode(NOT_FOUND).message('No Businesses').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(businesses).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const {
      name,
      serviceDescription,
      state,
      city,
      address,
      openingHours,
      estimatedFootTraffic,
      targetAudience,
      media,
      pricePerDay,
      durations,
      ownershipType,
      businessUrl,
      businessType,
    } = this.req.body as IBusiness

    const created = await BusinessModel.create({
      uid: this.user._id,
      name,
      serviceDescription,
      state,
      city,
      address,
      openingHours,
      estimatedFootTraffic,
      targetAudience,
      media,
      pricePerDay,
      durations,
      ownershipType,
      businessUrl,
      businessType,
      assets: assets || undefined,
      status: PENDING_APPROVAL,
    })
    if (!created) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('Error creating Business').send()
    } else {
      new Mailer()
        .setSubject('New Listed Business')
        .addRecipient({ name: 'Support', address: SharedConfig.get('SUPPORT_EMAIL') })
        .setBody(
          `
        <h2>Business Pending Approval</h2>
        <p>There is a newly listed business kindly attend to it.</p>
        <p>Business Name: ${name}</p>
        <p>Listed by: ${this.user?.firstname} ${this.user?.lastname}</p>
        <p>State: ${state}</p>
        <p>City: ${city}</p>
        <p>Address: ${address}</p>
        <p>Date: ${new Date().toISOString()}</p>`,
          SharedConfig.get('SITE_URL') + '/business',
        )
        .send()
      this.status(true).statusCode(POST_SUCCESS).message('Business created').setData(created).send()
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
      serviceDescription,
      state,
      city,
      address,
      openingHours,
      estimatedFootTraffic,
      targetAudience,
      media,
      pricePerDay,
      durations,
      ownershipType,
      businessUrl,
      businessType,
      status,
    } = this.req.body as IBusiness

    const definedValues = getDefinedValuesFrom({
      name,
      serviceDescription,
      state,
      city,
      address,
      openingHours,
      estimatedFootTraffic,
      targetAudience,
      media,
      pricePerDay,
      durations,
      ownershipType,
      businessUrl,
      businessType,
      assets: assets || undefined,
      status,
    })
    const { dataValues: prev } = (await BusinessModel.findByPk(_id)) || { dataValues: null }
    if (!(await this.ownerAndAdminAccess(prev?.uid!, false))) {
      assets?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    const [updatedCount, updatedRows] = await BusinessModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const { dataValues: updated } = updatedRows[0]

    if (updated && assets && prev?.assets) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('Business failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('Business updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const { dataValues: deleted } = (await BusinessModel.findOne({ where: { _id } })) || { dataValues: null }
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Business failed to be deleted due to error').send()
    } else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      await BusinessModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('Business deleted').setData(deleted).send()
    }
  }
}

export default Business
