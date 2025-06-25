import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import Business from './Business'
import BusinessModel from './BusinessModel'

const BusinessRoutes: IControllerRoute = {
  tag: 'Business',
  controller: Business,
  baseUrl: '/business',
  routes: [
    {
      path: '/business/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Business.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Businesss',
      },
    },
    {
      path: '/business/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Business by id',
      },
    },
    {
      path: '/business',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create Business',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/business',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update Business',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/business/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete Business',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: BusinessModel.getAttributes(),
  model: BusinessModel,
  description: 'Operation on Business',
}

export default BusinessRoutes
