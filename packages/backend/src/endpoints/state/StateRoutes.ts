import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import State from './State'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import StateModel from './StateModel'
import { getAttributes } from '../../libs/models/Attribute'

const StateRoutes: IControllerRoute = {
  baseUrl: '/state',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for states',
            example: 'California',
          },
        },
      },
      controllerMemberFunctionIdentifier: State.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all states',
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
            description: 'ID of the state to retrieve',
            example: '1234567890abcdef12345678',
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
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(StateModel),
      },
      metadata: {
        summary: 'Create state',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(StateModel) },
      metadata: {
        summary: 'Update state',
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
            description: 'ID of the state to delete',
            example: '1234567890abcdef12345678',
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
