import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Deposit from './Deposit'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import TransactionModel from '../transaction/TransactionModel'
import { getAttributes } from '../../libs/models/Attribute'

const DepositRoutes: IControllerRoute = {
  baseUrl: '/deposit',
  routes: [
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(TransactionModel),
      },
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
