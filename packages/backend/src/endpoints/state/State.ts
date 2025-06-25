/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { getDefinedValuesFrom } from '../../common';
import { NOT_FOUND, GET_SUCCESS, BAD_REQUEST, POST_SUCCESS } from '../../configs/statusCodeConstants';
import BaseController from '../../libs/controller/BaseController';
import PaginatingModel from '../../libs/models/PaginatingModel';
import IUser from '../user/IUser';
import IState from './IState';
import StateModel from './StateModel';

class State extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true;
  }

  async get({ _id }: any): Promise<void> {
    const state = await StateModel.findOne({ where: { _id } });
    if (!state) this.status(false).statusCode(NOT_FOUND).message('State not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(state).send();
  }

  async all() {
    const states = await new PaginatingModel<IState>(StateModel, this).markPublic(true).exec();
    if (!states) this.status(false).statusCode(NOT_FOUND).message('States not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(states).send();
  }

  async create(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj);
    const created = await StateModel.create(definedValues);
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating State').send();
    else this.status(true).statusCode(POST_SUCCESS).message('State created').setData(created).send();
  }

  async update(obj: any): Promise<void> {
    const definedValues = getDefinedValuesFrom(obj);
    const [updatedCount, updatedRows] = await StateModel.update(definedValues, {
      where: { id: obj?._id },
      returning: true,
    });
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('State failed to update due to error').send();
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('State updated').setData(updatedRows[0]).send();
    }
  }

  async delete({ _id }: any): Promise<void> {
    const deleted = await StateModel.findOne({ where: { _id } });
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('State failed to be deleted due to error').send();
    } else {
      await StateModel.destroy({ where: { _id } });
      this.status(true).statusCode(POST_SUCCESS).message('State deleted').setData(deleted).send();
    }
  }
}

export default State;