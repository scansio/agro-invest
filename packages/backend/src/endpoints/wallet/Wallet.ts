/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import WalletModel from './WalletModel';
import { GET_SUCCESS, NOT_FOUND } from '../../configs/statusCodeConstants';
import PaginatingModel from '../../libs/models/PaginatingModel';
import { ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT } from '../../configs/constants';
import UserModel from '../user/UserModel';
import NotFoundException from '../../exceptions/NotFoundException';
import SharedConfig from '../../libs/SharedConfig';
import IWallet from './IWallet';
import BaseController from '../../libs/controller/BaseController';

class Wallet extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async get() {}

  async all() {
    const wallets = await new PaginatingModel<IWallet>(WalletModel, this).exec();
    if (!wallets) this.status(false).statusCode(NOT_FOUND).message('Wallets not found').send();
    else this.status(true).statusCode(GET_SUCCESS).setData(wallets).send();
  }

  async confirmUser({ id: _id }: any) {
    if (!_id) {
      throw new NotFoundException(this, 'User not found');
    }
    const isUID = Number.parseInt(_id);
    let user = isUID && (await this.isValidUser(isUID));
    if (!user) {
      user = await UserModel.findOne({
        where: { _id },
      });
    }
    if (!user) {
      throw new NotFoundException(this, 'User not found');
    }
    this.status(true).statusCode(GET_SUCCESS).setData(user).send();
  }

  async balance({ uid }: any) {
    uid = uid || this?.user?._id;
    await this.ownerAndAdminAccess(uid);
    let balance = 0;
    let wallet = await WalletModel.findOne({
      where: { uid },
    });
    if (!wallet) {
      wallet = await WalletModel.create({ uid });
    }
    if (wallet) {
      balance = await wallet.getBalance();
    }
    this.status(true).statusCode(GET_SUCCESS).setData(balance).send();
  }

  async withdrawableBalance({ uid }: any) {
    uid = uid || this?.user?._id;
    await this.ownerAndAdminAccess(uid);
    const percentage =
      (SharedConfig.get('ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT') || ALLOWED_WITHDRAWAL_PERCENTAGE_SPOT) / 100.0;

    const userWallet = await WalletModel.findOne({
      where: { uid },
    });
    const userBalance = await userWallet?.getBalance();
    const percentageAmount = percentage * <number>userBalance;

    return await this.statusCode(GET_SUCCESS).success(`Success`).setData(percentageAmount).send();
  }
}

export default Wallet;