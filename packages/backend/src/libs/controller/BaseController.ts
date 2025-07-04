import { NextFunction, Request, Response } from 'express'
import Sender from './Sender'
import AllError from '../../exceptions/base/AllError'
import { Model, ModelStatic } from 'sequelize'
import { getUser, isToday, mongooseModelQueryObjectForTodayDoc } from '../../common'
import {
  AuthenticationLevel,
  TransactionType,
  MINIMUM_DEPOSIT_AMOUNT,
  MAXIMUM_DEPOSIT_AMOUNT,
  ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT,
  ACTIVE,
  WITHDRAWAL_DAY,
  WITHDRAWAL_DAY_DEFAULT,
} from '../../configs/constants'
import {
  OUT_OF_BOUNDARY,
  INVALID_AMOUNT,
  USER_NOTFOUND,
  INCORRECT_TRANSACTION_PIN,
  INSUFFICIENT_BALANCE_SPOT,
  WITHDRAWABLE_PERCENTAGE_EXCEEDED,
} from '../../configs/errorCodeConstants'
import { BAD_AUTHORIZATION, BAD_REQUEST, NOT_FOUND } from '../../configs/statusCodeConstants'
import IOption from '../../endpoints/option/IOption'
import OptionModel from '../../endpoints/option/OptionModel'
import IUser from '../../endpoints/user/IUser'
import UserModel from '../../endpoints/user/UserModel'
import WalletModel from '../../endpoints/wallet/WalletModel'
import AuthenticationException from '../../exceptions/AuthenticationException'
import MaintenanceException from '../../exceptions/MaintenanceException'
import SharedConfig from '../SharedConfig'
import ITimestamp from '../types/ITimestamp'

class BaseController extends Sender {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  public error404() {
    const error = new AllError('Route method not found')
    error.status = NOT_FOUND
    throw error
  }

  async initConstruct() {
    SharedConfig.set('controller', this)
    SharedConfig.set('user', getUser(this.req))
    SharedConfig.set('response', this.res)
    SharedConfig.set('request', this.req)

    SharedConfig.set(process.env)

    const options = await OptionModel.findAll()
    for (const option of options) {
      SharedConfig.set((option as any).name, (option as any).value)
    }
    if (this.isPrivateRoute) {
      switch (this.isPrivateRoute) {
        case AuthenticationLevel.END_USER:
          {
            await this.ownerAndAdminAccess(SharedConfig.get('user')?._id)
          }

          break

        case AuthenticationLevel.ADMIN:
          {
            await this.adminAccess()
          }
          break

        case AuthenticationLevel.DEVELOPER:
          {
            await this.developerAccess()
          }
          break

        default:
          throw new AuthenticationException(this)
          break
      }
    }

    //if (this.isPrivateRoute) {
    //Access to option are allowed even if site is under maintenance
    if (this.executingClassName !== 'Option') {
      const developers = await this.developerAccess(false)
      const admins = await this.adminAccess(false)

      //Blocks everyone except developers from accessing the api
      if (!developers && SharedConfig.get('SERVER_MAINTENANCE')) {
        throw new MaintenanceException(this)
      }

      //Allows only admins and developers access the api
      if (!admins && SharedConfig.get('BLOCK_ALL_USERS')) {
        throw new MaintenanceException(this)
      }

      //Blocks all admins from accessing the api
      if (!developers && admins && SharedConfig.get('BLOCK_ALL_ADMIN')) {
        throw new MaintenanceException(this)
      }
    }
    //}
  }

  async adminAccess(throwException = true): Promise<IUser | null | undefined | boolean> {
    const user = this?.user
    if (!user || (user.role !== AuthenticationLevel.DEVELOPER && user.role !== AuthenticationLevel.ADMIN)) {
      if (throwException) {
        await this.statusCode(BAD_AUTHORIZATION).errorCode(OUT_OF_BOUNDARY).error('Out of Boundary').send()
      }
      return null
    }
    return user
  }

  async developerAccess(throwException = true): Promise<IUser | null | undefined | boolean> {
    const user = this?.user
    if (!user || user.role !== AuthenticationLevel.DEVELOPER) {
      if (throwException) {
        await this.statusCode(BAD_AUTHORIZATION).errorCode(OUT_OF_BOUNDARY).error('Out of Boundary').send()
      }
      return null
    }
    return user
  }

  async ownerAccess(uid: IUser['_id'], throwException = true) {
    if (this?.user?._id == uid) {
      return true
    } else {
      if (throwException) {
        await this.errorCode(OUT_OF_BOUNDARY)
          .statusCode(BAD_AUTHORIZATION)
          .error("You don't have access to this resource")
          .send()
      }
    }
    return false
  }

  async ownerAndAdminAccess(uid: IUser['_id'], throwException = true) {
    if (this.cronJobAccess) {
      return true
    }
    const adminAccess = await this.adminAccess(false)
    if (adminAccess || this?.user?._id == uid) {
      return true
    } else {
      if (throwException) {
        await this.errorCode(OUT_OF_BOUNDARY)
          .statusCode(BAD_AUTHORIZATION)
          .error("You don't have access to this resource")
          .send()
      }
    }
    return false
  }

  checkZeroAmount(amount: number, throwException = true) {
    if (!amount || amount <= 0) {
      if (throwException)
        this.status(false)
          .statusCode(BAD_REQUEST)
          .errorCode(INVALID_AMOUNT)
          .message("Amount can't be less than 0")
          .send()
      else return false
    }
    return amount
  }

  isValidTransactionType(type: TransactionType, throwException = true) {
    switch (type) {
      case TransactionType.DEPOSIT:
      case TransactionType.WITHDRAW:
        break

      default:
        if (throwException)
          this.status(false)
            .statusCode(BAD_REQUEST)
            .errorCode(INVALID_AMOUNT)
            .message('Invalid transaction type')
            .send()
        else return false
        break
    }
    return type
  }

  checkMinMaxDepositAmount(amount: number, throwException = true) {
    this.checkZeroAmount(amount)
    const minAmountDeposit = SharedConfig.get(MINIMUM_DEPOSIT_AMOUNT) || 1000
    const maxAmountDeposit = SharedConfig.get(MAXIMUM_DEPOSIT_AMOUNT) || 4999999

    if (amount < minAmountDeposit || amount > maxAmountDeposit) {
      if (throwException)
        this.status(false)
          .statusCode(BAD_REQUEST)
          .errorCode(INVALID_AMOUNT)
          .message(`Amount can't be less than ${minAmountDeposit} or greater than ${maxAmountDeposit}`)
          .send()
      else return false
    }
    return amount
  }

  async isValidUser(uid: IUser['_id'], throwException = true) {
    const user = await UserModel.findByPk(uid)
    if (user) {
      return user
    } else {
      if (throwException) {
        return await this.statusCode(BAD_REQUEST).errorCode(USER_NOTFOUND).error('User does not exist').send()
      }
    }
    return null
  }

  async isValidUserPin(uid: IUser['_id'], pin: string | number, throwException = true) {
    const user = await UserModel.findOne({ where: { _id: uid, pin } })
    if (pin && `${pin}`.trim() !== '' && user) {
      return user
    } else {
      if (throwException) {
        return await this.statusCode(BAD_REQUEST)
          .errorCode(INCORRECT_TRANSACTION_PIN)
          .error('Incorrect pin OR Create transaction pin in Setting > Change Pin')
          .send()
      }
    }
    return null
  }

  async hasSufficientBalanceWallet(uid: IUser['_id'], amount: number, throwException = true) {
    const wallet = await WalletModel.findOne({ where: { uid } })
    const balance = wallet && (await wallet.getBalance())
    const sufficientBalance = <number>balance >= amount
    if (sufficientBalance) {
      return balance
    } else {
      if (throwException) {
        await this.status(false)
          .errorCode(INSUFFICIENT_BALANCE_SPOT)
          .statusCode(BAD_REQUEST)
          .message('Insufficient balance')
          .send()
      }
    }
    return false
  }

  async checkPercentageSpotWithdraw(uid: IUser['_id'], amount: number, throwException = true) {
    this.checkZeroAmount(amount)
    await this.hasSufficientBalanceWallet(uid, amount)
    const percentage =
      (SharedConfig.get('ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT') || ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT) / 100.0

    const userWallet = await WalletModel.findOne({ where: { uid } })
    const userBalance = await userWallet?.getBalance()
    const percentageAmount = percentage * <number>userBalance

    if (amount <= percentageAmount) {
      return true
    } else {
      if (throwException) {
        this.status(false)
          .errorCode(WITHDRAWABLE_PERCENTAGE_EXCEEDED)
          .statusCode(BAD_REQUEST)
          .message('Withrawable amount exceeded')
          .send()
      }
    }
    return false
  }

  async checkWithdrawalDay<T extends ITimestamp>(
    uid: IUser['_id'],
    model: ModelStatic<Model<T>>,
    throwException = true,
  ) {
    const userTransactions = await model.findAll({
      where: {
        //@ts-ignore
        uid,
        status: ACTIVE,
        ...mongooseModelQueryObjectForTodayDoc('createdAt.date'),
      },
    })

    const withdrawal_day = SharedConfig.get(WITHDRAWAL_DAY) || WITHDRAWAL_DAY_DEFAULT

    if ((!userTransactions || userTransactions.length <= 0) && isToday(withdrawal_day)) {
      return true
    } else {
      if (throwException) {
        this.status(false)
          //.errorCode(TRANSFERABLE_PERCENTAGE_EXCEEDED)
          .statusCode(BAD_REQUEST)
          .message(`You can only withdraw/transfer from profit/bonus wallets once every ${withdrawal_day}`)
          .send()
      }
    }
    return false
  }
}

export default BaseController
