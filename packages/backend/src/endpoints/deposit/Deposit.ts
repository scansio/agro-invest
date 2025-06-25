/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { TransactionType } from '../../configs/constants'
import { GET_SUCCESS, NOT_FOUND } from '../../configs/statusCodeConstants'
import PaginatingModel from '../../libs/models/PaginatingModel'
import ITransaction from '../transaction/ITransaction'
import BaseController from '../../libs/controller/BaseController'
import Transaction from '../transaction/Transaction'
import TransactionModel from '../transaction/TransactionModel'

class Deposit extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async all() {
    const found = await new PaginatingModel<ITransaction>(TransactionModel, this)
      .where({ type: TransactionType.DEPOSIT }).exec()
      
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Transactions not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async create(data: any) {
    await new Transaction(this.req, this.res, this.next).create({ ...data, type: TransactionType.DEPOSIT, description: "Wallet deposit", })
  }
}

export default Deposit
