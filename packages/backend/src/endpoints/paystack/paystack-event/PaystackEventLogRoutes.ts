import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import PaystackEventLog from './PaystackEventLog'
import PaystackEventLogModel from './PaystackEventLogModel'

const PaystackEventLogRoutes: IControllerRoute = {
  tag: 'PaystackEventLog',
  controller: PaystackEventLog,
  baseUrl: '/paystack-event-log',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: PaystackEventLog.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all paystack-event-logs',
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
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get paystack-event-log by id',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create paystack-event-log',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update paystack-event-log',
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
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete paystack-event-log',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: PaystackEventLogModel.getAttributes(),
  model: PaystackEventLogModel,
  description: 'Operation on paystack-event-log',
}

export default PaystackEventLogRoutes
