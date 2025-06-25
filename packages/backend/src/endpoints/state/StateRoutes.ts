import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import State from './State'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import StateModel from './StateModel'

const StateRoutes: IControllerRoute = {
  baseUrl: '/state',
  routes: [
    {
      path: '/state/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: State.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all states',
      },
    },
    {
      path: '/state/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get state by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/state',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/state',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/state/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: StateModel.getAttributes(),
  model: StateModel,
  tag: 'State',
  description: 'Operation on State model',
  controller: State,
}

export default StateRoutes
