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
import SocialAdvertModel from './SocialAdvertModel'
import { ISocialAdvert } from './ISocialAdvert'
import {
  ACTIVE,
  BOOKED_ADVERT_SYSTEM_CHARGE,
  INACTIVE,
  TransactionMode,
  TransactionType,
} from '../../../configs/constants'
import { rand } from '../../../libs/md5'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import TransactionModel from '../../transaction/TransactionModel'
import SocialModel from '../social/SocialModel'
import UserModel from '../../user/UserModel'

class SocialAdvert extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await SocialAdvertModel.findByPk(id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('SocialAdvert not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const SocialAdverts = await new PaginatingModel<ISocialAdvert>(SocialAdvertModel, this)
      .uidKey(['uid', 'socialOwnerId'])
      .exec()
    if (!SocialAdverts) this.status(false).statusCode(NOT_FOUND).message('No SocialAdverts').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(SocialAdverts).send()
  }

  async create() {
    let assets: string[] | null = null
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      assets = ((await filestore.uploadForMultiple('assets')) as string[]) || null
    }
    const {
      socialId,
      duration,
      contentFormat,
      estimatedTraffic,
      callToAction,
      description,
      targetAudience,
      campaignStartDate,
      campaignEndDate,
    } = this.req.body as ISocialAdvert

    const socialModel = await SocialModel.findByPk(socialId as any)
    if (!socialModel) {
      throw new Error('Invalid social')
    }
    const social = socialModel.dataValues

    let amount = social?.pricePerDay

    //Calculate content format increase in %
    amount += social?.pricePerDay * ((contentFormat?.increaseInPercentage || 0) / 100)

    //Calculate estimated traffic increase in %
    amount += social?.pricePerDay * ((estimatedTraffic?.increaseInPercentage || 0) / 100)
    
    //Calculate total base on number of days
    amount = amount * (duration?.numberOfDays || 0)

    await this.hasSufficientBalanceWallet(this.user._id, amount)

    const created = await SocialAdvertModel.create({
      uid: this.user._id,
      socialId,
      socialOwnerId: social?.uid,
      duration,
      contentFormat,
      amount,
      callToAction,
      description,
      targetAudience,
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
        description: `SocialAdvert placement at ${social?.platform}`,
        extra: `SocialAdvert::${created.dataValues._id}::${TransactionType.CHARGE}`,
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
      this.status(false).statusCode(BAD_REQUEST).message('Error creating SocialAdvert').send()
    } else {
      const socialOwner = social?.uid as any as IUser

      new Mailer()
        .setSubject('SocialAdvert Booking')
        .addRecipient({ name: socialOwner.firstname, address: socialOwner.email })
        .setBody(
          `
        <h2>SocialAdvert Placement</h2>
        <p>${this.user.firstname} ${this.user.lastname} placed an ad on your social for ${
            duration.numberOfDays
          } day(s)</p>
        <p>Amount: ${transaction.dataValues.currency}${transaction.dataValues.amount}</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
          SharedConfig.get('SITE_URL') + '/social-advert',
        )
        .send()
      this.status(true).statusCode(POST_SUCCESS).message('SocialAdvert created').setData(created).send()
    }
  }

  async update() {
    let assets: string[] | null | undefined
    const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
    if (this.req.headers['content-type']?.includes('multipart')) {
      const temp = (await filestore.uploadFor('assets', 'validationUrls')) || null
      assets = temp?.assets as string[] | undefined
    }

    const {
      _id,
      socialId,
      socialOwnerId,
      duration,
      contentFormat,
      placementCompleted,
      rejected,
      amount,
      validationUrls,
      campaignStartDate,
      campaignEndDate,
      status,
    } = this.req.body as ISocialAdvert

    if (placementCompleted && !(await this.adminAccess(false))) {
      throw new Error('Only admin can mark this advert as completed')
    }

    const definedValues = getDefinedValuesFrom({
      socialId,
      socialOwnerId,
      duration,
      contentFormat,
      rejected,
      placementCompleted,
      amount,
      campaignStartDate,
      campaignEndDate,
      assets: assets || undefined,
      validationUrls,
      status,
    })
    const { dataValues: prev } = (await SocialAdvertModel.findByPk(_id)) || { dataValues: null }

    if (
      !(await this.ownerAndAdminAccess(prev?.uid!, false)) &&
      !(await this.ownerAndAdminAccess(prev?.socialOwnerId!, false))
    ) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      return this.status(false).statusCode(BAD_AUTHORIZATION).message('You do not have access to this resource').send()
    }

    if (rejected && prev?.uid == this.user._id) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      throw new Error('You cannot reject your advert')
    }

    if (rejected && prev?.placementCompleted) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      throw new Error('Order has already been marked as completed and you have received your payment')
    }

    if (placementCompleted && prev?.rejected) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      throw new Error('Order has already been marked as rejected by the social')
    }

    if (
      !(await this.adminAccess(false)) &&
      prev?.socialOwnerId == this.user._id &&
      !(rejected || validationUrls?.length)
    ) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      return await this.statusCode(BAD_AUTHORIZATION).error("You don't have access to this resource").send()
    }

    if (prev?.uid !== this.user._id && prev?.socialOwnerId !== this.user._id) {
      assets?.forEach((asset) => filestore.delete(asset))
      validationUrls?.forEach((asset) => filestore.delete(asset))
      return await this.statusCode(BAD_AUTHORIZATION).error("You don't have access to this resource").send()
    }

    const [updatedCount, updatedRows] = await SocialAdvertModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const { dataValues: updated } = updatedRows[0]

    if (!prev?.placementCompleted && placementCompleted && updated) {
      const { dataValues: socialOwner } = (await this.isValidUser(updated.socialOwnerId)) as UserModel
      await TransactionModel.create({
        uid: socialOwner?._id,
        amount: updated.amount,
        currency: 'NGN',
        type: TransactionType.PAYMENT,
        mode: TransactionMode.SUCCESS,
        description: `Payment for advert placement. SocialAdvertID: ${updated._id}`,
        extra: `SocialAdvert::${updated._id}::${TransactionType.PAYMENT}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
      const chargePercentage = SharedConfig.get('BOOKED_ADVERT_SYSTEM_CHARGE') || BOOKED_ADVERT_SYSTEM_CHARGE
      await TransactionModel.create({
        uid: socialOwner?._id,
        amount: updated.amount * (chargePercentage / 100.0),
        currency: 'NGN',
        type: TransactionType.SYSTEM_CHARGE,
        mode: TransactionMode.SUCCESS,
        description: `System charge for advert placement. SocialAdvertID: ${updated._id}`,
        extra: `SocialAdvert::${updated._id}::${TransactionType.PAYMENT}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
      new Mailer()
        .setSubject('SocialAdvert Placement Confirmation')
        .addRecipient({ name: socialOwner?.firstname!, address: socialOwner?.email! })
        .setBody(
          `
              <h2>Booked SocialAdvert</h2>
              <p>We have confirmed that you placed the booked advert.</p>
              <p>You should be able to receive your payment.</p>
              <p>SocialAdvert ID: ${updated._id}</p>
              `,
          '#',
        )
        .send()
    }

    if (updated && assets?.length && prev?.assets?.length) {
      prev.assets.forEach((asset) => filestore.delete(asset))
    }

    if (updated && rejected) {
      const transactionModel = await TransactionModel.findOne({
        where: { extra: `SocialAdvert::${_id}::${TransactionType.CHARGE}` },
      })
      if (transactionModel) {
        transactionModel.set('status', INACTIVE)
        await transactionModel.save()
      }
    }

    if (!updated) {
      assets?.forEach((asset) => filestore.delete(asset))
      this.status(false).statusCode(BAD_REQUEST).message('SocialAdvert failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('SocialAdvert updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const { dataValues: deleted } = (await SocialAdvertModel.findOne({ where: { _id } })) || { dataValues: null }
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('SocialAdvert failed to be deleted due to error').send()
    else {
      const filestore = new FileStore(this, true, ['image/jpeg', 'image/png', 'video/mp4'], 25)
      deleted.assets?.forEach((asset) => filestore.delete(asset))
      await SocialAdvertModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('SocialAdvert deleted').setData(deleted).send()
    }
  }
}

export default SocialAdvert
