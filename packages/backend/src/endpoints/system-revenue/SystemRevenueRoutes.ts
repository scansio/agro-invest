import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { getAttributes } from '../../libs/models/Attribute'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import SystemRevenue from './SystemRevenue'
import SystemRevenueModel from './SystemRevenueModel'

const SystemRevenueRoutes: IControllerRoute = {
  baseUrl: '/system-revenue',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for system revenues',
            example: 'Monthly revenue',
          },
        },
      },
      controllerMemberFunctionIdentifier: SystemRevenue.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all system revenues',
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
            description: 'ID of the system revenue to retrieve',
            example: '1234567890abcdef12345678',
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
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(SystemRevenueModel),
      },
      metadata: {
        summary: 'Create system revenue',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(SystemRevenueModel),
      },
      metadata: {
        summary: 'Update system revenue',
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
            description: 'ID of the system revenue to delete',
            example: '1234567890abcdef12345678',
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
