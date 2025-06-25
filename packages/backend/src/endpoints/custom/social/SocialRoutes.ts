import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import Social from './Social'
import SocialModel from './SocialModel'

const SocialRoutes: IControllerRoute = {
  tag: 'Social',
  controller: Social,
  baseUrl: '/social',
  routes: [
    {
      path: '/social/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Social.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Socials',
      },
    },
    {
      path: '/social/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Social by id',
      },
    },
    {
      path: '/social',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create Social',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/social',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update Social',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/social/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete Social',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: SocialModel.getAttributes(),
  model: SocialModel,
  description: 'Operation on Social',
}

export default SocialRoutes
