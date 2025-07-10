/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import TeamModel from './TeamModel'
import IUser from '../user/IUser'
import { NOT_FOUND, BAD_REQUEST, GET_SUCCESS, POST_SUCCESS } from '../../configs/statusCodeConstants'
import PaginatingModel from '../../libs/models/PaginatingModel'
import { getDefinedValuesFrom } from '../../common'
import ITeam from './ITeam'
import UserModel from '../user/UserModel'
import { ACTIVE } from '../../configs/constants'
import IPaginating from '../../libs/types/IPaginating'
import UserProfileModel from '../user/UserProfileModel'
import BaseController from '../../libs/controller/BaseController'

class Team extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await TeamModel.findOne({
      where: { _id, status: ACTIVE },
      include: [
        { model: UserProfileModel, as: 'profileIdPopulated' },
        { model: UserModel, as: 'uidPopulated' },
      ],
    })
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Team not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async getTeamMemberByName({ firstname, lastname }: any) {
    const user = await UserModel.findOne({
      where: { firstname, lastname },
    })
    const found = await TeamModel.findOne({
      where: { uid: `${user?._id}`, status: ACTIVE },
      include: [
        { model: UserProfileModel, as: 'profileIdPopulated' },
        { model: UserModel, as: 'uidPopulated' },
      ],
    })
    if (!found) {
      this.status(false).statusCode(NOT_FOUND).message('Team not found').send()
    } else {
      this.status(true).statusCode(GET_SUCCESS).setData(found).send()
    }
  }

  async all() {
    const teams = await new PaginatingModel<ITeam>(TeamModel, this)
      .include([
        { model: UserProfileModel, as: 'profileIdPopulated' },
        { model: UserModel, as: 'uidPopulated' },
      ])
      .markPublic(true)
      .exec()
    if (!teams) this.status(false).statusCode(NOT_FOUND).message('No Teams').send()
    else {
      ;(teams as any).results = (teams as IPaginating<ITeam>).results?.map((team) => {
        delete ((team as any).uidPopulated as any).password
        delete ((team as any).uidPopulated as any).pin
        return team
      })
      this.status(true).statusCode(GET_SUCCESS).setData(teams).send()
    }
  }

  async create({ uid, title }: any) {
    const profile = await UserProfileModel.findOne({
      where: { uid },
      include: [{ model: UserModel, as: 'uidPopulated' }],
    })
    if (!profile) return this.status(false).statusCode(BAD_REQUEST).message('User profile not found').send()
    const created = await TeamModel.create({ uid, profileId: profile?._id, title })
    if (!created) this.status(false).statusCode(BAD_REQUEST).message('Error creating Team').send()
    else this.status(true).statusCode(POST_SUCCESS).message('Team created').setData(created).send()
  }

  async update({ _id, uid, title, status }: any) {
    const definedValues = getDefinedValuesFrom({
      uid,
      title,
      status,
    })
    const [updatedCount, updatedRows] = await TeamModel.update(definedValues, {
      where: { _id },
      returning: true,
    })
    if (updatedCount === 0) {
      this.status(false).statusCode(BAD_REQUEST).message('Team failed to update due to error').send()
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Team updated').setData(updatedRows[0]).send()
    }
  }

  async delete({ _id }: any) {
    const deleted = await TeamModel.findOne({ where: { _id } })
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Team failed to be deleted due to error').send()
    } else {
      await TeamModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('Team deleted').setData(deleted).send()
    }
  }
}

export default Team
