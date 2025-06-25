import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import SocialAdvert from './SocialAdvert'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import SocialAdvertModel from './SocialAdvertModel'

const SocialAdvertRoutes: IControllerRoute = {
  tag: 'SocialAdvert',
  controller: SocialAdvert,
  baseUrl: '/social-advert',
  routes: [
    {
      path: '/social-advert/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: SocialAdvert.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all SocialAdverts',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/social-advert/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get SocialAdvert by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/social-advert',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create SocialAdvert',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/social-advert',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update SocialAdvert',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/social-advert/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete SocialAdvert',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: SocialAdvertModel.getAttributes(),
  model: SocialAdvertModel,
  description: 'Operation on SocialAdvert',
}

export default SocialAdvertRoutes
