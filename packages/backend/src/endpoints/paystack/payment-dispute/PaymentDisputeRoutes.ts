import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import PaymentDispute from './PaymentDispute'
import PaymentDisputeModel from './PaymentDisputeModel'

const PaymentDisputeRoutes: IControllerRoute = {
  tag: 'PaymentDispute',
  controller: PaymentDispute,
  baseUrl: '/payment-dispute',
  routes: [
    {
      path: '/payment-dispute/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: PaymentDispute.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all payment-disputes',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/payment-dispute/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
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
      path: '/payment-dispute',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create payment-dispute',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/payment-dispute',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update payment-dispute',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/payment-dispute/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
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
