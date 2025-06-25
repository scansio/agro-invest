/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import IUser from '../../user/IUser';
import { NOT_FOUND, BAD_REQUEST, GET_SUCCESS, POST_SUCCESS } from '../../../configs/statusCodeConstants';
import PaginatingModel from '../../../libs/models/PaginatingModel';
import { getDefinedValuesFrom } from '../../../common';
import IPaystackEventLog from './IPaystackEventLog';
import BaseController from '../../../libs/controller/BaseController';
import PaystackEventLogModel from './PaystackEventLogModel';

class PaystackEventLog extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ _id }: any) {
    const found = await PaystackEventLogModel.findByPk(`${_id}`);
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Paystack event log not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send();
  }

  async all() {
    const paystackEventLogs = await new PaginatingModel<IPaystackEventLog>(PaystackEventLogModel, this).exec();
    if (!paystackEventLogs) this.status(false).statusCode(NOT_FOUND).message('No Paystack event logs').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(paystackEventLogs).send();
  }

  async create({ raw }: any) {
    const created = await PaystackEventLogModel.create({ raw });
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Paystack event log').send();
    else
      this.status(true).statusCode(POST_SUCCESS).message('Paystack event log created').setData(created).send();
  }

  async update({ _id, raw, status }: any) {
    const definedValues = getDefinedValuesFrom({
      raw,
      status,
    });
    const [updatedCount, updatedRows] = await PaystackEventLogModel.update(definedValues, {
      where: { _id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Paystack event log failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Paystack event log updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any) {
    const deleted = await PaystackEventLogModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Paystack event log failed to be deleted due to error').send();
    } else {
      await PaystackEventLogModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('Paystack event log deleted').setData(deleted).send();
    }
  }
}

export default PaystackEventLog;