import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import FarmInvestment from './FarmInvestment'
import FarmInvestmentModel from './FarmInvestmentModel'

const FarmInvestmentRoutes: IControllerRoute = {
  tag: 'FarmInvestment',
  controller: FarmInvestment,
  baseUrl: '/farm-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: FarmInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all FarmInvestments',
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
        summary: 'Get FarmInvestment by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create FarmInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update FarmInvestment',
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
        summary: 'Delete FarmInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: FarmInvestmentModel.getAttributes(),
  model: FarmInvestmentModel,
  description: 'Operation on FarmInvestment',
}

export default FarmInvestmentRoutes
