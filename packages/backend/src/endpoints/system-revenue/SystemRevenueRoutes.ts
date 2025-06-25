import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import SystemRevenue from './SystemRevenue'
import SystemRevenueModel from './SystemRevenueModel'

const SystemRevenueRoutes: IControllerRoute = {
  baseUrl: '/system-revenue',
  routes: [
    {
      path: '/system-revenue/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: SystemRevenue.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all system revenues',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/system-revenue/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get system-revenue by id',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/system-revenue',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create system revenue',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/system-revenue',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update system revenue',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/system-revenue/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete system revenue',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: SystemRevenueModel.getAttributes(),
  model: SystemRevenueModel,
  tag: 'SystemRevenue',
  description: 'Operation on SystemRevenue model',
  controller: SystemRevenue,
}

export default SystemRevenueRoutes
