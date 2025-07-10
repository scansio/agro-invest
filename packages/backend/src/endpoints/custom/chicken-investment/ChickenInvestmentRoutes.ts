import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import ChickenInvestment from './ChickenInvestment'
import ChickenInvestmentModel from './ChickenInvestmentModel'

const ChickenInvestmentRoutes: IControllerRoute = {
  tag: 'ChickenInvestment',
  controller: ChickenInvestment,
  baseUrl: '/chicken-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: ChickenInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all ChickenInvestments',
      },
    },
    {
      path: '/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get ChickenInvestment by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create ChickenInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update ChickenInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete ChickenInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: ChickenInvestmentModel.getAttributes(),
  model: ChickenInvestmentModel,
  description: 'Operation on ChickenInvestment',
}

export default ChickenInvestmentRoutes
