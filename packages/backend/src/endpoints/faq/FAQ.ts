/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { getDefinedValuesFrom } from '../../common';
import { ACTIVE } from '../../configs/constants';
import { NOT_FOUND, GET_SUCCESS, BAD_REQUEST, POST_SUCCESS } from '../../configs/statusCodeConstants';
import BaseController from '../../libs/controller/BaseController';
import PaginatingModel from '../../libs/models/PaginatingModel';
import IUser from '../user/IUser';
import FAQModel from './FAQModel';
import { IFAQ } from './IFAQ';

class FAQ extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ _id }: any) {
    const found = await FAQModel.findOne({
      where: { _id, status: ACTIVE },
    });
    if (!found) this.status(false).statusCode(NOT_FOUND).message('FAQ not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send();
  }

  async all() {
    const FAQs = await new PaginatingModel<IFAQ>(FAQModel, this).markPublic(true).exec();
    if (!FAQs) this.status(false).statusCode(NOT_FOUND).message('No FAQs').send();
    else {
      this.status(true).statusCode(GET_SUCCESS).setData(FAQs).send();
    }
  }

  async create({ question, answer }: any) {
    const created = await FAQModel.create({ question, answer });
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating FAQ').send();
    else this.status(true).statusCode(POST_SUCCESS).message('FAQ created').setData(created).send();
  }

  async update({ _id, question, answer, status }: any) {
    const definedValues = getDefinedValuesFrom({
      question,
      answer,
      status,
    });
    const [updatedCount, updatedRows] = await FAQModel.update(definedValues, {
      where: { _id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('FAQ failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('FAQ updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any) {
    const deleted = await FAQModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('FAQ failed to be deleted due to error').send();
    } else {
      await FAQModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('FAQ deleted').setData(deleted).send();
    }
  }
}

export default FAQ;