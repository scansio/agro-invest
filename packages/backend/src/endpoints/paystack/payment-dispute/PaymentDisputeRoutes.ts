import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import PaymentDispute from './PaymentDispute'
import PaymentDisputeModel from './PaymentDisputeModel'

const PaymentDisputeRoutes: IControllerRoute = {
  tag: 'PaymentDispute',
  controller: PaymentDispute,
  baseUrl: '/payment-dispute',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for payment disputes',
            example: 'Dispute over payment for service',
          },
        },
      },
      controllerMemberFunctionIdentifier: PaymentDispute.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all payment-disputes',
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
            description: 'ID of the payment-dispute to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get payment-dispute by id',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(PaymentDisputeModel),
      },
      metadata: {
        summary: 'Create payment-dispute',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(PaymentDisputeModel),
      },
      metadata: {
        summary: 'Update payment-dispute',
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
            description: 'ID of the payment-dispute to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete payment-dispute',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: PaymentDisputeModel.getAttributes(),
  model: PaymentDisputeModel,
  description: 'Operation on payment-dispute',
}

export default PaymentDisputeRoutes
