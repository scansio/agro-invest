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
import AdvertModel from './AdvertModel'
import { IAdvert } from './IAdvert'
import {
  ACTIVE,
  BOOKED_ADVERT_SYSTEM_CHARGE,
  INACTIVE,
  TransactionMode,
  TransactionType,
} from '../../../configs/constants'
import { rand } from '../../../libs/md5'
import ITransaction from '../../transaction/ITransaction'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import TransactionModel from '../../transaction/TransactionModel'
import BusinessModel from '../business/BusinessModel'
import UserModel from '../../user/UserModel'

class Advert extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await AdvertModel.findByPk(id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Advert not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Adverts = await new PaginatingModel<IAdvert>(AdvertModel, this).uidKey(['uid', 'businessOwnerId']).exec()
    if (!Adverts) this.status(false).statusCode(NOT_FOUND).message('No Adverts').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Adverts).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const { businessId, duration, contentFormat, campaignStartDate, campaignEndDate } = this.req.body as IAdvert

    const businessModel = await BusinessModel.findByPk(businessId as any)
    if (!businessModel) {
      throw new Error('Invalid business')
    }
    const business = businessModel.dataValues

    const amount =
      (business?.pricePerDay + business?.pricePerDay * ((contentFormat?.increaseInPercentage || 0) / 100)) *
      (duration?.numberOfDays || 0)

    await this.hasSufficientBalanceWallet(this.user._id, amount)

    const created = await AdvertModel.create({
      uid: this.user._id,
      businessId,
      businessOwnerId: business?.uid,
      duration,
      contentFormat,
      amount,
      campaignStartDate,
      campaignEndDate,
      assets: assets || undefined,
    })

    let transaction: TransactionModel | null = null
    try {
      transaction = await TransactionModel.create({
        uid: this.user._id,
        amount,
        currency: 'NGN',
        type: TransactionType.CHARGE,
        mode: TransactionMode.SUCCESS,
        description: `Advert placement at ${business?.name}`,
        extra: `Advert::${created.dataValues._id}::${TransactionType.CHARGE}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
    } catch (error: any) {
      await created.destroy()
      assets?.forEach((asset) => filestore.delete(asset))
      throw error
    }

    if (!created) {
      await transaction?.destroy()
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('Error creating Advert').send()
    } else {
      const businessOwner = business?.uid as any as IUser

      new Mailer()
        .setSubject('Advert Booking')
        .addRecipient({ name: businessOwner.firstname, address: businessOwner.email })
        .setBody(
          `
        <h2>Advert Placement</h2>
        <p>${this.user.firstname} ${this.user.lastname} placed an ad on your business for ${
            duration.numberOfDays
          } day(s)</p>
        <p>Amount: ${transaction.dataValues.currency}${transaction.dataValues.amount}</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
          SharedConfig.get('SITE_URL') + '/advert',
        )
        .send()
      this.status(true).statusCode(POST_SUCCESS).message('Advert created').setData(created).send()
    }
  }

  async update() {
    let assets: string[] | null | undefined
    let validationAssets: string[] | null | undefined
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      const temp = (await filestore.uploadFor('assets', 'validationAssets')) || null
      assets = temp?.assets as string[] | undefined
      validationAssets = temp?.validationAssets as string[] | undefined
    }

    const {
      _id,
      businessId,
      businessOwnerId,
      duration,
      contentFormat,
      placementCompleted,
      rejected,
      amount,
      campaignStartDate,
      campaignEndDate,
      status,
    } = this.req.body as IAdvert

    if (placementCompleted && !(await this.adminAccess(false))) {
      throw new Error('Only admin can mark this advert as completed')
    }

    const definedValues = getDefinedValuesFrom({
      businessId,
      businessOwnerId,
      duration,
      contentFormat,
      rejected,
      placementCompleted,
      amount,
      campaignStartDate,
      campaignEndDate,
      assets: assets || undefined,
      validationAssets: validationAssets || undefined,
      status,
    })
    const { dataValues: prev } = (await AdvertModel.findByPk(_id)) || { dataValues: null }

    if (
      !(await this.ownerAndAdminAccess(prev?.uid!, false)) &&
      !(await this.ownerAndAdminAccess(prev?.businessOwnerId!, false))
    ) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    if (rejected && prev?.uid == this.user._id) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      throw new Error('You cannot reject your advert')
    }

    if (rejected && prev?.placementCompleted) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      throw new Error('Order has already been marked as completed and you have received your payment')
    }

    if (placementCompleted && prev?.rejected) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      throw new Error('Order has already been marked as rejected by the business')
    }

    if (
      !(await this.adminAccess(false)) &&
      prev?.businessOwnerId == this.user._id &&
      !(rejected || validationAssets?.length)
    ) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      return await this.statusCode(BAD_AUTHORIZATION).error("You don't have access to this resource").send()
    }

    if (prev?.uid !== this.user._id && prev?.businessOwnerId !== this.user._id) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((asset) => filestore.delete(asset))
      return await this.statusCode(BAD_AUTHORIZATION).error("You don't have access to this resource").send()
    }

    const [updatedCount, updatedRows] = await AdvertModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const { dataValues: updated } = updatedRows[0]

    if (!prev?.placementCompleted && placementCompleted && updated) {
      const { dataValues: businessOwner } = (await this.isValidUser(updated.businessOwnerId)) as UserModel
      await TransactionModel.create({
        uid: businessOwner?._id,
        amount: updated.amount,
        currency: 'NGN',
        type: TransactionType.PAYMENT,
        mode: TransactionMode.SUCCESS,
        description: `Payment for advert placement. AdvertID: ${updated._id}`,
        extra: `Advert::${updated._id}::${TransactionType.PAYMENT}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
      const chargePercentage = SharedConfig.get('BOOKED_ADVERT_SYSTEM_CHARGE') || BOOKED_ADVERT_SYSTEM_CHARGE
      await TransactionModel.create({
        uid: businessOwner?._id,
        amount: updated.amount * (chargePercentage / 100.0),
        currency: 'NGN',
        type: TransactionType.SYSTEM_CHARGE,
        mode: TransactionMode.SUCCESS,
        description: `System charge for advert placement. AdvertID: ${updated._id}`,
        extra: `Advert::${updated._id}::${TransactionType.PAYMENT}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
      new Mailer()
        .setSubject('Advert Placement Confirmation')
        .addRecipient({ name: businessOwner?.firstname!, address: businessOwner?.email! })
        .setBody(
          `
              <h2>Booked Advert</h2>
              <p>We have confirmed that you placed the booked advert.</p>
              <p>You should be able to receive your payment.</p>
              <p>Advert ID: ${updated._id}</p>
              `,
          '#',
        )
        .send()
    }

    if (updated && assets?.length && prev?.assets?.length) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (updated && validationAssets?.length && prev?.validationAssets?.length) {
      prev.validationAssets.forEach((validationAsset) => filestore.delete(validationAsset))
    }

    if (updated && rejected) {
      const transactionModel = await TransactionModel.findOne({
        where: { extra: `Advert::${_id}::${TransactionType.CHARGE}` },
      })
      if (transactionModel) {
        transactionModel.set('status', INACTIVE)
        await transactionModel.save()
      }
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationAssets?.forEach((validationAsset) => filestore.delete(validationAsset))
      this.status(false).statusCode(BAD_REQUEST).message('Advert failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('Advert updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const { dataValues: deleted } = (await AdvertModel.findOne({ where: { _id } })) || { dataValues: null }
    if (!deleted) this.status(false).statusCode(BAD_REQUEST).message('Advert failed to be deleted due to error').send()
    else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      deleted.validationAssets?.forEach((validationAsset) => filestore.delete(validationAsset))
      await AdvertModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('Advert deleted').setData(deleted).send()
    }
  }
}

export default Advert
