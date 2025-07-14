import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
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
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for LandInvestments',
            example: 'Investment in land development',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the LandInvestment to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: getAttributes(
          LandInvestmentModel,
          { uid: true },
          {
            expenses: {
              type: 'array',
              required: true,
              itemOptions: {
                type: 'string',
              },
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
        summary: 'Create LandInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(
          LandInvestmentModel,
          { uid: true },
          {
            expenses: {
              type: 'array',
              required: true,
              itemOptions: {
                type: 'string',
              },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the LandInvestment to delete',
            example: '1234567890abcdef12345678',
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
