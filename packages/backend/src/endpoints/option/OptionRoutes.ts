import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Option from './Option'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import OptionModel from './OptionModel'
import { getAttributes } from '../../libs/models/Attribute'

const OptionRoutes: IControllerRoute = {
  tag: 'Option',
  controller: Option,
  baseUrl: '/option',
  routes: [
    {
      path: '/publics',
      controllerMemberFunctionIdentifier: Option.prototype.publics,
      fields: {},
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get public options',
      },
    },
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for options',
            example: 'agriculture',
          },
        },
      },
      controllerMemberFunctionIdentifier: Option.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all options',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/:name',
      validation: {
        param: {
          name: {},
        },
      },
      fields: {
        param: {
          name: {
            type: 'string',
            description: 'Constant name of the option to retrieve',
            example: 'agriculture',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get option by constant name',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(OptionModel),
      },
      metadata: {
        summary: 'Create option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(OptionModel),
      },
      metadata: {
        summary: 'Update option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
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
            description: 'ID of the option to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
  ],
  schema: OptionModel.getAttributes(),
  model: OptionModel,
  description: 'Operation on Option model',
}

export default OptionRoutes
