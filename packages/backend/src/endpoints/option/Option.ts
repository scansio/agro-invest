/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { getDefinedValuesFrom } from '../../common';
import { OPTION_NOTFOUND, UNABLE_TO_COMPLETE_REQUEST } from '../../configs/errorCodeConstants';
import {
  SERVICE_UNAVAILABLE,
  GET_SUCCESS,
  NOT_FOUND,
  POST_SUCCESS,
  BAD_REQUEST,
} from '../../configs/statusCodeConstants';
import BaseController from '../../libs/controller/BaseController';
import PaginatingModel from '../../libs/models/PaginatingModel';
import IOption from './IOption';
import OptionModel from './OptionModel';

class Option extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init() {
    return true;
  }

  async get({ name }: any) {
    const isAdmin = await this.adminAccess(false);

    const option = await OptionModel.findOne({
      where: {
        name: `${name}`,
        ...(isAdmin ? {} : { isPublic: true }),
      },
    });
    if (!option) {
      return await this.statusCode(SERVICE_UNAVAILABLE)
        .errorCode(OPTION_NOTFOUND)
        .message(`${name} option not found`)
        .send();
    } else {
      return await this.statusCode(GET_SUCCESS).message('Success').status(true).setData(option).send();
    }
  }

  async all() {
    const options = await new PaginatingModel<IOption>(OptionModel, this).exec();
    if (!options) this.status(false).statusCode(NOT_FOUND).message('Options not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(options).send();
  }

  async create({ name, value, description, isPublic }: any) {
    isPublic === 1 && (isPublic = true);
    try {
      const created = await OptionModel.create({
        name,
        value,
        description,
        isPublic,
      });
      return await this.statusCode(POST_SUCCESS).message('Option created').status(true).setData(created).send();
    } catch (error) {
      return await this.statusCode(SERVICE_UNAVAILABLE)
        .errorCode(UNABLE_TO_COMPLETE_REQUEST)
        .message((error as Error).message)
        .send();
    }
  }

  async update({ _id, name, value, description, isPublic }: any): Promise<void> {
    isPublic === 1 && (isPublic = true);
    const definedValues = getDefinedValuesFrom({
      name,
      value,
      description,
      isPublic,
    });
    const [updatedCount, updatedRows] = await OptionModel.update(definedValues, {
      where: { _id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Option failed to update').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Option updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any): Promise<void> {
    const deleted = await OptionModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Option failed to be deleted').send();
    } else {
      await OptionModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('Option deleted').setData(deleted).send();
    }
  }

  async publics() {
    const options = await OptionModel.findAll({
      where: { isPublic: true },
    });
    if (!options) {
      return await this.statusCode(SERVICE_UNAVAILABLE)
        .errorCode(OPTION_NOTFOUND)
        .message(`Public options not found`)
        .send();
    } else {
      return await this.statusCode(GET_SUCCESS).message('Success').status(true).setData(options).send();
    }
  }
}

export default Option;