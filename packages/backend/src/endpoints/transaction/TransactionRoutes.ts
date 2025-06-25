import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Transaction from './Transaction'
import TransactionModel from './TransactionModel'

const TransactionRoutes: IControllerRoute = {
  baseUrl: '/transaction',
  routes: [
    {
      path: '/transaction/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Transaction.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all transactions',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/transaction/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get transaction by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/transaction',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create transaction',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/transaction',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update transaction',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/transaction/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete transaction',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: TransactionModel.getAttributes(),
  model: TransactionModel,
  tag: 'Transaction',
  description: 'Operation on Transaction model',
  controller: Transaction,
}

export default TransactionRoutes
