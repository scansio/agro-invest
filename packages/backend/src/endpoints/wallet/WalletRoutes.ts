import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Wallet from './Wallet'
import WalletModel from './WalletModel'

const WalletRoutes: IControllerRoute = {
  baseUrl: '/wallet',
  routes: [
    {
      path: '/wallet/confirm-user/:_id',
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
      path: '/wallet/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Wallet.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all wallet',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/wallet/balance/:uid',
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
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/wallet/withdrawable/:uid([0-9]{8})?',
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
