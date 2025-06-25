import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Countrie from './Countrie'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import CountrieModel from './CountrieModel'

const CountrieRoutes: IControllerRoute = {
  tag: 'Countrie',
  controller: Countrie,
  baseUrl: '/countrie',
  routes: [
    {
      path: '/countrie/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Countrie.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all countries',
      },
    },
    {
      path: '/countrie/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get countrie by id',
      },
    },
    {
      path: '/countrie',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/countrie',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update country',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/countrie/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
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
