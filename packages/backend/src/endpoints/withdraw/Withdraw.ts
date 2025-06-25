/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { TransactionType } from '../../configs/constants'
import { NOT_FOUND, GET_SUCCESS } from '../../configs/statusCodeConstants'
import BaseController from '../../libs/controller/BaseController'
import PaginatingModel from '../../libs/models/PaginatingModel'
import ITransaction from '../transaction/ITransaction'
import Transaction from '../transaction/Transaction'
import TransactionModel from '../transaction/TransactionModel'

class Withdraw extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async all() {
    const transactions = await new PaginatingModel<ITransaction>(TransactionModel, this).exec()
    if (!transactions) this.status(false).statusCode(NOT_FOUND).message('Transactions not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(transactions).send()
  }

  async create(data: any) {
    await new Transaction(this.req, this.res, this.next).create({ ...data, type: TransactionType.WITHDRAW, description: "Wallet withdrawal", })
  }
}

export default Withdraw
