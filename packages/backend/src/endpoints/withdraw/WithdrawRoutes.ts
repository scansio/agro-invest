import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import TransactionModel from '../transaction/TransactionModel'
import Withdraw from './Withdraw'

const WithdrawRoutes: IControllerRoute = {
  baseUrl: '/withdraw',
  routes: [
    {
      path: '/withdraw',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create withdrawal',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
  ],
  schema: TransactionModel.getAttributes(),
  model: TransactionModel,
  tag: 'Withdraw',
  description: 'Operation on Withdraw model',
  controller: Withdraw,
}

export default WithdrawRoutes
