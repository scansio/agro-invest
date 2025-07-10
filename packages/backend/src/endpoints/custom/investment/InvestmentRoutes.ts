import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import Investment from './Investment'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import InvestmentModel from './InvestmentModel'

const InvestmentRoutes: IControllerRoute = {
  tag: 'Investment',
  controller: Investment,
  baseUrl: '/investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Investment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Investments',
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
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Investment by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create Investment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
      validation: {
        body: {
          investmentType: { notEmpty: {} },
          investmentId: { notEmpty: {} },
          unit: { notEmpty: {}, isNumeric: { min: 1 } },
        },
      },
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update Investment',
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
        summary: 'Delete Investment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: InvestmentModel.getAttributes(),
  model: InvestmentModel,
  description: 'Operation on Investment',
}

export default InvestmentRoutes
