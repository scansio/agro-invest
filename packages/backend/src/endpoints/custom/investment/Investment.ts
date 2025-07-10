/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import IUser from '../../user/IUser'
import { NOT_FOUND, BAD_REQUEST, GET_SUCCESS, POST_SUCCESS } from '../../../configs/statusCodeConstants'
import PaginatingModel from '../../../libs/models/PaginatingModel'
import { getDefinedValuesFrom } from '../../../common'
import InvestmentModel from './InvestmentModel'
import { IInvestment } from './IInvestment'
import { ACTIVE, TransactionMode, TransactionType } from '../../../configs/constants'
import { rand } from '../../../libs/md5'
import Mailer from '../../../libs/Mailer'
import SharedConfig from '../../../libs/SharedConfig'
import BaseController from '../../../libs/controller/BaseController'
import TransactionModel from '../../transaction/TransactionModel'
import CropInvestmentModel from '../crop-investment/CropInvestmentModel'
import FarmInvestmentModel from '../farm-investment/FarmInvestmentModel'
import AnimalInvestmentModel from '../animal-investment/AnimalInvestmentModel'
import ChickenInvestmentModel from '../chicken-investment/ChickenInvestmentModel'
import LandInvestmentModel from '../land-investment/LandInvestmentModel'

class Investment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ id }: any) {
    const found = await InvestmentModel.findByPk(id)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Investment not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const Investments = await new PaginatingModel<IInvestment>(InvestmentModel, this).exec()
    if (!Investments) this.status(false).statusCode(NOT_FOUND).message('No Investments').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(Investments).send()
  }

  async create({ investmentType, investmentId, unit }) {
    const models = {
      CropInvestment: CropInvestmentModel,
      FarmInvestment: FarmInvestmentModel,
      AnimalInvestment: AnimalInvestmentModel,
      ChickenInvestment: ChickenInvestmentModel,
      LandInvestment: LandInvestmentModel,
    }

    const investmentModel = `${investmentType}Investment`

    const investmentTypeModel: FarmInvestmentModel = await models[investmentModel].findByPk(investmentId as any)
    if (!investmentTypeModel) {
      throw new Error('Invalid type of investment or invalid investmentId')
    }

    let mode,
      investmentImageUrl,
      investmentROI,
      value,
      earned = undefined as any

    const isLandInvestment = investmentModel === 'LandInvestment'
    if (isLandInvestment) {
      mode = 'completed'
      investmentROI = 0
    } else {
      mode = 'active'
      investmentROI = investmentTypeModel.roi
    }

    const amount = isLandInvestment
      ? (investmentTypeModel as any as LandInvestmentModel).price
      : investmentTypeModel.pricePerUnit * unit
    await this.hasSufficientBalanceWallet(this.user._id, amount)

    value = amount
    investmentImageUrl = investmentTypeModel.assets ? investmentTypeModel.assets[0] : undefined
    earned = 0

    const investmentName = (investmentTypeModel as any).name || investmentType
    const created = await InvestmentModel.create({
      uid: this.user._id,
      mode,
      investmentImageUrl,
      investmentModel,
      investmentId,
      investmentName,
      investmentROI,
      unit,
      value,
      earned,
    })

    let transaction: TransactionModel | null = null
    try {
      transaction = await TransactionModel.create({
        uid: this.user._id,
        amount,
        currency: 'NGN',
        type: TransactionType.CHARGE,
        mode: TransactionMode.SUCCESS,
        description: `Purchage of ${investmentName} investment.`,
        extra: `${investmentModel}::${created._id}`,
        reference: `${this.user?.firstname[0].toUpperCase()}${rand(
          123456789,
          987654321,
        )}${this.user?.lastname[0].toUpperCase()}`,
        rawJSONData: [],
        status: ACTIVE,
      })
    } catch (error: any) {
      await created.destroy()
      throw error
    }

    if (!created) {
      await transaction?.destroy()
      return this.status(false).statusCode(BAD_REQUEST).message('Error creating Investment').send()
    } else {
      const investmentOwner = this.user

      new Mailer()
        .setSubject(`${investmentName} Order`)
        .addRecipient({ name: investmentOwner.firstname, address: investmentOwner.email })
        .setBody(
          `
        <h2>Order summary</h2>
        <p>Here is a brief summary of your investment order</p>
        <p>Unit: ${unit}</p>
        <p>Type: ${investmentModel}</p>
        <p>ROI: ${investmentROI}</p>
        <p>Mode: ${mode}</p>
        <p>Amount: $${transaction.amount}</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
          SharedConfig.get('SITE_URL') + '/home',
        )
        .send()
      return await this.status(true).statusCode(POST_SUCCESS).message('Investment created').setData(created).send()
    }
  }

  async update({
    _id,
    mode,
    investmentImageUrl,
    investmentModel,
    investmentId,
    investmentName,
    investmentROI,
    unit,
    value,
    earned,
    status,
  }) {
    const definedValues = getDefinedValuesFrom({
      mode,
      investmentImageUrl,
      investmentModel,
      investmentId,
      investmentName,
      investmentROI,
      unit,
      value,
      earned,
      status,
    })

    const [, updatedRows] = await InvestmentModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    const updated = updatedRows[0]

    if (!updated) {
      this.status(false).statusCode(BAD_REQUEST).message('Investment failed to update due to error').send()
    } else this.status(true).statusCode(POST_SUCCESS).message('Investment updated').setData(updated).send()
  }

  async delete({ _id }: any) {
    const deleted = await InvestmentModel.findOne({ where: { _id } })
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('Investment failed to be deleted due to error').send()
    else {
      await InvestmentModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('Investment deleted').setData(deleted).send()
    }
  }
}

export default Investment
