/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import IUser from '../../user/IUser'
import { NOT_FOUND, GET_SUCCESS } from '../../../configs/statusCodeConstants'
import BaseController from '../../../libs/controller/BaseController'
import AnimalInvestmentModel from '../animal-investment/AnimalInvestmentModel'
import ChickenInvestmentModel from '../chicken-investment/ChickenInvestmentModel'
import CropInvestmentModel from '../crop-investment/CropInvestmentModel'
import FarmInvestmentModel from '../farm-investment/FarmInvestmentModel'
import LandInvestmentModel from '../land-investment/LandInvestmentModel'
import { ModelStatic } from 'sequelize'

class HotInvestment extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ name }: any) {
    const investments: { [type: string]: ModelStatic<any> } = {
      animal: AnimalInvestmentModel,
      chicken: ChickenInvestmentModel,
      crop: CropInvestmentModel,
      land: LandInvestmentModel,
      farm: FarmInvestmentModel,
    }

    const investmentsData = (
      await Promise.all(
        Object.entries(investments).map(async ([type, Model]) => {
          return (
            await Model.findAll({
              where: {
                ...(name ? { name } : {}),
                /* featureNo: {
                  gt: 0,
                }, */
              },
              limit: 5,
            })
          ).map((row) => {
            return { ...JSON.parse(JSON.stringify(row)), type }
          })
        }),
      )
    )
      .flat()
      .sort((a, b) => b.featureNo - a.featureNo)
      .filter((investment) => investment.featureNo > 0)

    this.status(true).statusCode(GET_SUCCESS).setData(investmentsData).send()
  }
}

export default HotInvestment
