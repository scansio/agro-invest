import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import AnimalInvestment from './AnimalInvestment'
import AnimalInvestmentModel from './AnimalInvestmentModel'

const AnimalInvestmentRoutes: IControllerRoute = {
  tag: 'AnimalInvestment',
  controller: AnimalInvestment,
  baseUrl: '/animal-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for AnimalInvestments',
            example: 'Investment in cattle',
          },
        },
      },
      controllerMemberFunctionIdentifier: AnimalInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all AnimalInvestments',
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
            description: 'ID of the AnimalInvestment to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get AnimalInvestment by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(
          AnimalInvestmentModel,
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
        summary: 'Create AnimalInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(
          AnimalInvestmentModel,
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
        summary: 'Update AnimalInvestment',
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
            description: 'ID of the AnimalInvestment to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete AnimalInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: AnimalInvestmentModel.getAttributes(),
  model: AnimalInvestmentModel,
  description: 'Operation on AnimalInvestment',
}

export default AnimalInvestmentRoutes
