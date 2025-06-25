/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import IUser from '../../user/IUser';
import { NOT_FOUND, BAD_REQUEST, GET_SUCCESS, POST_SUCCESS } from '../../../configs/statusCodeConstants';
import PaginatingModel from '../../../libs/models/PaginatingModel';
import { getDefinedValuesFrom } from '../../../common';
import IPaymentDispute from './IPaymentDispute';
import BaseController from '../../../libs/controller/BaseController';
import PaymentDisputeModel from './PaymentDisputeModel';

class PaymentDispute extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ _id }: any) {
    const found = await PaymentDisputeModel.findByPk(`${_id}`);
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Payment dispute not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send();
  }

  async all() {
    const paymentDisputes = await new PaginatingModel<IPaymentDispute>(PaymentDisputeModel, this).exec();
    if (!paymentDisputes) this.status(false).statusCode(NOT_FOUND).message('No PaymentDisputes').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(paymentDisputes).send();
  }

  async create({ id, event, raw }: any) {
    const created = await PaymentDisputeModel.create({ id, event, raw });
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating PaymentDispute').send();
    else this.status(true).statusCode(POST_SUCCESS).message('Payment dispute created').setData(created).send();
  }

  async update({ id, _id, event, raw }: any) {
    const definedValues = getDefinedValuesFrom({
      _id,
      id,
      event,
      raw,
    });
    const [updatedCount, updatedRows] = await PaymentDisputeModel.update(definedValues, {
      where: { _id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Payment dispute failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Payment dispute updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any) {
    const deleted = await PaymentDisputeModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Payment dispute failed to be deleted due to error').send();
    } else {
      await PaymentDisputeModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('Payment dispute deleted').setData(deleted).send();
    }
  }
}

export default PaymentDispute;