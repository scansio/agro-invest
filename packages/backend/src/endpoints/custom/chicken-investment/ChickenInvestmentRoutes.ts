import { get } from 'http'
import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import ChickenInvestment from './ChickenInvestment'
import ChickenInvestmentModel from './ChickenInvestmentModel'
import { getAttributes } from '../../../libs/models/Attribute'

const ChickenInvestmentRoutes: IControllerRoute = {
  tag: 'ChickenInvestment',
  controller: ChickenInvestment,
  baseUrl: '/chicken-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for ChickenInvestments',
            example: 'Investment in poultry farming',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the ChickenInvestment to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: getAttributes(
          ChickenInvestmentModel,
          { uid: true },
          {
            expenses: {
              type: "array",
              required: true,
              itemOptions: {
                type: "string",
              }
            },
            assets: {
              type: 'image',
              multiple: true,
              required: true,
              accept: '.jpg,.jpeg,.png',
            },
          },
        ),
      },
      metadata: {
        summary: 'Create ChickenInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(
          ChickenInvestmentModel,
          { uid: true },
          {
            expenses: {
              type: "array",
              required: true,
              itemOptions: {
                type: "string",
              }
            },
            assets: {
              type: 'image',
              multiple: true,
              required: true,
              accept: '.jpg,.jpeg,.png',
            },
          },
        ),
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the ChickenInvestment to delete',
            example: '1234567890abcdef12345678',
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
