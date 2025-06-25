/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import SystemRevenueModel from './SystemRevenueModel';
import { BAD_REQUEST, GET_SUCCESS, NOT_FOUND, POST_SUCCESS } from '../../configs/statusCodeConstants';
import PaginatingModel from '../../libs/models/PaginatingModel';
import { getDefinedValuesFrom } from '../../common';
import ISystemRevenue from './ISystemRevenue';
import BaseController from '../../libs/controller/BaseController';

class SystemRevenue extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init() {
    return true;
  }

  async get({ _id }: any) {
    const systemRevenue = await SystemRevenueModel.findByPk(`${_id}`);
    if (!systemRevenue) this.status(false).statusCode(NOT_FOUND).message('System Revenue not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(systemRevenue).send();
  }

  async create({ admin, address, type, reference, amount, description }: any) {
    const created = await SystemRevenueModel.create({
      admin,
      address,
      type,
      reference,
      amount,
      description,
    });
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating SystemRevenue').send();
    else this.status(true).statusCode(POST_SUCCESS).message('System Revenue created').setData(created).send();
  }

  async update({ _id, admin, address, type, reference, amount, description }: any) {
    const definedValues = getDefinedValuesFrom({
      admin,
      address,
      type,
      reference,
      amount,
      description,
    });
    const [updatedCount, updatedRows] = await SystemRevenueModel.update(definedValues, {
      where: { _id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('System Revenue failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('System Revenue updated').setData(updatedRows[0]).send();
    }
  }

  async all() {
    const systemRevenues = await new PaginatingModel<ISystemRevenue>(SystemRevenueModel, this).exec();
    if (!systemRevenues) this.status(false).statusCode(NOT_FOUND).message('System Revenues not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(systemRevenues).send();
  }

  async delete({ _id }: any) {
    const deleted = await SystemRevenueModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('System Revenue failed to be deleted due to error').send();
    } else {
      await SystemRevenueModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('System Revenue deleted').setData(deleted).send();
    }
  }
}

export default SystemRevenue;