import { randomInt } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { TransactionType, TransactionMode, UserType } from '../../configs/constants'
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS } from '../../configs/statusCodeConstants'
import NotFoundException from '../../exceptions/NotFoundException'
import BaseController from '../../libs/controller/BaseController'
import Mailer from '../../libs/Mailer'
import PaginatingModel from '../../libs/models/PaginatingModel'
import { Paystack } from '../../libs/Paystack'
import SharedConfig from '../../libs/SharedConfig'
import ITransaction from './ITransaction'
import TransactionModel from './TransactionModel'
import Logger from '../../libs/Logger'
import UserModel from '../user/UserModel'

class Transaction extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init() {
    return true
  }

  async get({ _id }: any) {
    const isAdmin = await this.adminAccess(false)
    let found
    if (isAdmin) {
      found = await TransactionModel.findByPk(_id)
    } else {
      found = await TransactionModel.findOne({
        where: {
          _id,
          uid: this?.user?._id,
        },
      })
    }
    if (!found) throw new NotFoundException(this, 'Transactions not found')
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const transactions = await new PaginatingModel<ITransaction>(TransactionModel, this).exec()
    if (!transactions) throw new NotFoundException(this, 'Transactions not found')
    else this.status(true).statusCode(GET_SUCCESS).setData(transactions).send()
  }

  async create({ uid, currency = 'NGN', amount, type, description, baseCallbackURL }: any) {
    if (type === TransactionType.DEPOSIT && !baseCallbackURL) {
      return await this.statusCode(BAD_REQUEST).error('baseCallbackURL required on deposit').send()
    }
    this.directRequest = true
    uid = !uid ? this.user._id : uid
    this.checkMinMaxDepositAmount(amount)
    this.isValidTransactionType(type)
    const { dataValues: user } = (await this.isValidUser(uid)) as UserModel
    const reference = `${user?.firstname[0].toUpperCase()}${randomInt(
      123456789,
      987654321,
    )}${user?.lastname[0].toUpperCase()}`
    let callback_url = baseCallbackURL + process.env.PAYSTACK_CALLBACK_ENDPOINT!
    callback_url = callback_url.replace(':reference', reference)

    switch (type) {
      case TransactionType.DEPOSIT:
        {
          const paymentInitialization = await Paystack.transaction.initialize({
            email: user!.email,
            amount: amount * 100,
            reference,
            callback_url,
          })

          if (!paymentInitialization.status) {
            Logger.log('error', paymentInitialization)
          }

          const created =
            paymentInitialization.status &&
            (await TransactionModel.create({
              uid,
              currency,
              amount,
              type,
              mode: TransactionMode.PENDING,
              description,
              callback_url,
              reference,
            }))

          if (!created) return await this.statusCode(BAD_REQUEST).error('Transaction failed to be created').send()
          else
            return await this.statusCode(POST_SUCCESS)
              .success('Transaction created')
              .setData({ authorization_url: paymentInitialization.data.authorization_url })
              .send()
        }
        break

      case TransactionType.WITHDRAW:
        {
          await this.hasSufficientBalanceWallet(uid, amount)
          if (this.user.type !== UserType.PARTNER) {
            throw new Error("You can't book a withdrawal. Please contact support.")
          }

          const created = await TransactionModel.create({
            uid,
            currency,
            amount,
            type,
            mode: TransactionMode.PENDING,
            description: description || 'Withdrawal placement',
            rawJSONData: [],
            reference,
          })

          if (!created) return await this.statusCode(BAD_REQUEST).error('Transaction failed to be created').send()
          else {
            new Mailer()
              .setSubject('Withdrawal Transaction')
              .addRecipient({ name: 'Support', address: SharedConfig.get('SUPPORT_EMAIL') })
              .setBody(
                `
                <h2>Withdrawal Placement</h2>
                <p>There is a withdrawal placement kindly attend to it.</p>
                <p>Name: ${user?.firstname} ${user?.lastname}</p>
                <p>Amount: ${currency}${amount}</p>
                <p>Reference: ${reference}</p>
                <p>Date: ${new Date().toISOString()}</p>
                `,
                '#',
              )
              .send()

            return await this.statusCode(POST_SUCCESS).success('Transaction created').setData(created).send()
          }
        }
        break

      default:
        return await this.statusCode(BAD_REQUEST).error('Transaction failed to be created').send()
        break
    }
  }

  async update({ _id, currency, amount, charge, type, mode, description, rawJSONData, status }: any) {
    const definedValues = getDefinedValuesFrom({
      currency,
      amount,
      charge,
      type,
      mode,
      description,
      rawJSONData,
      status,
    })
    const [updatedCount, updatedRows] = await TransactionModel.update(definedValues, {
      where: { _id },
      returning: true,
    })
    if (updatedCount === 0)
      return await this.statusCode(BAD_REQUEST).error('Transaction failed to update due to error').send()
    else return await this.statusCode(POST_SUCCESS).success('Transaction updated').setData(updatedRows[0]).send()
  }

  async delete({ _id }: any) {
    const deleted = await TransactionModel.destroy({ where: { _id } })
    if (!deleted)
      return await this.statusCode(BAD_REQUEST).error('Transaction failed to be deleted due to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Transaction deleted').send()
  }
}

export default Transaction
