import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import LandInvestment from './LandInvestment'
import LandInvestmentModel from './LandInvestmentModel'

const LandInvestmentRoutes: IControllerRoute = {
  tag: 'LandInvestment',
  controller: LandInvestment,
  baseUrl: '/land-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: LandInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all LandInvestments',
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
        summary: 'Get LandInvestment by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create LandInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update LandInvestment',
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
        summary: 'Delete LandInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: LandInvestmentModel.getAttributes(),
  model: LandInvestmentModel,
  description: 'Operation on LandInvestment',
}

export default LandInvestmentRoutes
