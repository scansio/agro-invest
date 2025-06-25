/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { getDefinedValuesFrom } from '../../common';
import { GET_SUCCESS, BAD_REQUEST, POST_SUCCESS, NOT_FOUND } from '../../configs/statusCodeConstants';
import BaseController from '../../libs/controller/BaseController';
import PaginatingModel from '../../libs/models/PaginatingModel';
import IUser from '../user/IUser';
import CountrieModel from './CountrieModel';
import ICountrie from './ICountrie';

class Countrie extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ id }: any): Promise<void> {
    const countrie = await CountrieModel.findOne({ where: { id } });
    if (!countrie) this.status(false).statusCode(NOT_FOUND).message('Countrie not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(countrie).send();
  }

  async all() {
    const countries = await new PaginatingModel<ICountrie>(CountrieModel, this).markPublic(true).exec();
    if (!countries) this.status(false).statusCode(NOT_FOUND).message('Countries not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(countries).send();
  }

  async create(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj);
    const created = await CountrieModel.create(definedValues);
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Countrie').send();
    else this.status(true).statusCode(POST_SUCCESS).message('Countrie created').setData(created).send();
  }

  async update(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj);
    const [updatedCount, updatedRows] = await CountrieModel.update(definedValues, {
      where: { _id: obj?._id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Countrie failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Countrie updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any): Promise<void> {
    const deleted = await CountrieModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Countrie failed to be deleted due to error').send();
    } else {
      await CountrieModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('Countrie deleted').setData(deleted).send();
    }
  }
}

export default Countrie;