import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import Advert from './Advert'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import AdvertModel from './AdvertModel'

const AdvertRoutes: IControllerRoute = {
  tag: 'Advert',
  controller: Advert,
  baseUrl: '/advert',
  routes: [
    {
      path: '/advert/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Advert.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Adverts',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/advert/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Advert by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/advert',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create Advert',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/advert',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update Advert',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/advert/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete Advert',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: AdvertModel.getAttributes(),
  model: AdvertModel,
  description: 'Operation on Advert',
}

export default AdvertRoutes
