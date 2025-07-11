import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { getAttributes } from '../../libs/models/Attribute'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Transaction from './Transaction'
import TransactionModel from './TransactionModel'

const TransactionRoutes: IControllerRoute = {
  baseUrl: '/transaction',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for transactions',
            example: 'Payment for service',
          },
        },
      },
      controllerMemberFunctionIdentifier: Transaction.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all transactions',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
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
            description: 'ID of the transaction to retrieve',
            example: '1234567890abcdef12345678',
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
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(TransactionModel),
      },
      metadata: {
        summary: 'Create transaction',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(TransactionModel) },
      metadata: {
        summary: 'Update transaction',
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
            description: 'ID of the transaction to delete',
            example: '1234567890abcdef12345678',
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
