import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Countrie from './Countrie'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import CountrieModel from './CountrieModel'
import { getAttributes } from '../../libs/models/Attribute'

const CountrieRoutes: IControllerRoute = {
  tag: 'Countrie',
  controller: Countrie,
  baseUrl: '/countrie',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for countries',
            example: 'United States',
          },
        },
      },
      controllerMemberFunctionIdentifier: Countrie.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all countries',
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
            description: 'ID of the country to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get countrie by id',
      },
    },
    {
      path: '/',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create country',
      },
      fields: {
        body: getAttributes(CountrieModel),
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(CountrieModel) },
      metadata: {
        summary: 'Update country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
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
            description: 'ID of the country to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: CountrieModel.getAttributes(),
  model: CountrieModel,
  description: 'Countries endpoints',
}

export default CountrieRoutes
