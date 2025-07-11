import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
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
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for FarmInvestments',
            example: 'Investment in farming',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the FarmInvestment to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: getAttributes(FarmInvestmentModel),
      },
      metadata: {
        summary: 'Create FarmInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(FarmInvestmentModel) },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the FarmInvestment to delete',
            example: '1234567890abcdef12345678',
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
