import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Deposit from './Deposit'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import TransactionModel from '../transaction/TransactionModel'

const DepositRoutes: IControllerRoute = {
  baseUrl: '/deposit',
  routes: [
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create deposit',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
  ],
  schema: TransactionModel.getAttributes(),
  model: TransactionModel,
  tag: 'Deposit',
  description: 'Operation on Deposit model',
  controller: Deposit,
}

export default DepositRoutes
