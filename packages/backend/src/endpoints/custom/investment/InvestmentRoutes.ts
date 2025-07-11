import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import Investment from './Investment'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import InvestmentModel from './InvestmentModel'
import { get } from 'http'
import { getAttributes } from '../../../libs/models/Attribute'

const InvestmentRoutes: IControllerRoute = {
  tag: 'Investment',
  controller: Investment,
  baseUrl: '/investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for Investments',
            example: 'Investment in agriculture',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the Investment to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: {
          investmentType: {
            type: 'string',
            description: 'Type of investment (e.g., crop, animal, farm)',
            example: 'crop',
          },
          investmentId: {
            type: 'string',
            description: 'ID of the investment entity (e.g., crop ID)',
            example: 'crop12345',
          },
          unit: {
            type: 'number',
            description: 'Number of units invested',
            default: 10,
            min: 10,
            example: 10,
          },
        },
      },
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
      fields: {
        body: getAttributes(InvestmentModel),
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the Investment to delete',
            example: '1234567890abcdef12345678',
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
