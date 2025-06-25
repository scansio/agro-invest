import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Option from './Option'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import OptionModel from './OptionModel'

const OptionRoutes: IControllerRoute = {
  tag: 'Option',
  controller: Option,
  baseUrl: '/option',
  routes: [
    {
      path: '/option/publics',

      controllerMemberFunctionIdentifier: Option.prototype.publics,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get public options',
      },
    },
    {
      path: '/option/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Option.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all options',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/option/:name',
      validation: {
        param: {
          name: {},
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get option by constant name',
      },
    },
    {
      path: '/option',

      method: RequestMethods.POST,
      metadata: {
        summary: 'Create option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/option',

      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update option',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/option/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
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
