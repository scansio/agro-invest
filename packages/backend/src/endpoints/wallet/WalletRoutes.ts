import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Wallet from './Wallet'
import WalletModel from './WalletModel'

const WalletRoutes: IControllerRoute = {
  baseUrl: '/wallet',
  routes: [
    {
      path: '/confirm-user/:_id',
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'User ID to confirm for transfer',
            example: '12345678',
          },
        },
      },
      controllerMemberFunctionIdentifier: Wallet.prototype.confirmUser,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Confirm user to transfer to',
      },
      validation: {
        param: {
          _id: {
            notEmpty: {},
            isLength: { min: 8, max: 8 },
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Query string to filter wallets',
            example: 'uid=1234567890',
          },
        },
      },
      controllerMemberFunctionIdentifier: Wallet.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all wallet',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/balance/:uid',
      method: RequestMethods.GET,
      controllerMemberFunctionIdentifier: Wallet.prototype.balance,
      metadata: {
        summary: 'Get user wallet balance',
      },
      validation: {
        param: {
          uid: {
            isNumeric: { minLength: 10, message: 'Id should be number' },
            isLength: {
              min: 10,
              max: 10,
              message: 'Id should not be greater or less than 10',
            },
          },
        },
      },
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to get balance for',
            example: '1234567890',
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/withdrawable/:uid([0-9]{8})?',
      controllerMemberFunctionIdentifier: Wallet.prototype.withdrawableBalance,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get setting user setting by name',
      },
      validation: {
        param: {
          uid: {},
        },
      },
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to get withdrawable balance for',
            example: '12345678',
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
  ],
  schema: WalletModel.getAttributes(),
  model: WalletModel,
  tag: 'Wallet',
  description: 'Operation on Wallet model',
  controller: Wallet,
}

export default WalletRoutes
