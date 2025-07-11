import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
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
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for paystack-event-logs',
            example: 'Payment event log',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the paystack-event-log to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: getAttributes(PaystackEventLogModel),
      },
      metadata: {
        summary: 'Create paystack-event-log',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(PaystackEventLogModel),
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the paystack-event-log to delete',
            example: '1234567890abcdef12345678',
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
