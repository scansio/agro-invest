/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { getDefinedValuesFrom } from '../../../common';
import { ACTIVE } from '../../../configs/constants';
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOT_FOUND } from '../../../configs/statusCodeConstants';
import BankDetailModel from './BankDetailModel';
import PaginatingModel from '../../../libs/models/PaginatingModel';
import IBankDetail from './IBankDetail';
import IUser from '../../user/IUser';
import BaseController from '../../../libs/controller/BaseController';

class BankDetail extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ _id }: any) {
    const found = await BankDetailModel.findOne({ where: { _id, status: ACTIVE } });
    if (!found) {
      this.status(false).statusCode(NOT_FOUND).message('Bank detail not found').send();
    } else {
      await this.ownerAndAdminAccess(found.dataValues?.uid!);
      this.status(true).statusCode(GET_SUCCESS).setData(found).send();
    }
  }

  async getBankDetailByUid({ uid }: any) {
    await this.ownerAndAdminAccess(uid);
    const found = await BankDetailModel.findOne({ where: { uid } });
    if (!found) {
      this.status(false).statusCode(NOT_FOUND).message('Bank detail not found').send();
    } else {
      this.status(true).statusCode(GET_SUCCESS).setData(found).send();
    }
  }

  async all() {
    const bankDetails = await new PaginatingModel<IBankDetail>(BankDetailModel, this).exec();
    if (!bankDetails) {
      this.status(false).statusCode(NOT_FOUND).message('No bank details').send();
    } else {
      this.status(true).statusCode(GET_SUCCESS).setData(bankDetails).send();
    }
  }

  async create({ accountName, accountNumber, bankName }: any) {
    const created = await BankDetailModel.create({
      uid: this.user._id,
      accountName,
      accountNumber,
      bankName,
    });
    if (!created) {
      this.status(false).statusCode(BAD_REQUEST).message('Error creating bank detail').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Bank detail created').setData(created).send();
    }
  }

  async update({ _id, accountName, accountNumber, bankName, status }: any) {
    const definedValues = getDefinedValuesFrom({
      accountName,
      accountNumber,
      bankName,
      status,
    });
    const beforeUpdate = await BankDetailModel.findByPk(_id);
    if (!beforeUpdate) {
      this.status(false).statusCode(NOT_FOUND).message('Bank detail not found').send();
      return;
    }
    await this.ownerAndAdminAccess(beforeUpdate.dataValues?.uid!);

    const [updatedCount, updatedRows] = await BankDetailModel.update(definedValues, {
      where: { _id },
      returning: true,
    });

    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Bank detail failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Bank detail updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any) {
    const deleted = await BankDetailModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Bank detail failed to be deleted due to error').send();
    } else {
      await BankDetailModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('Bank detail deleted').setData(deleted).send();
    }
  }
}

export default BankDetail;