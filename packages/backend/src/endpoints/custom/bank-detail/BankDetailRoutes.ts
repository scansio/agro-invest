import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import BankDetail from './BankDetail'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import BankDetailModel from './BankDetailModel'

const BankDetailRoutes: IControllerRoute = {
  tag: 'BankDetail',
  controller: BankDetail,
  baseUrl: '/bank-detail',
  routes: [
    {
      path: '/bank-detail/all',
      validation: { query: { q: {} } },
      controllerMemberFunctionIdentifier: BankDetail.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all bank details',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/bank-detail/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get bank detail by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/bank-detail/:uid([0-9]{8})',
      controllerMemberFunctionIdentifier: BankDetail.prototype.getBankDetailByUid,
      validation: {
        param: {
          uid: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get bank detail by uid',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/bank-detail',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create bank detail',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/bank-detail',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update bank detail',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/bank-detail/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete bank detail',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: BankDetailModel.getAttributes(),
  model: BankDetailModel,
  description: 'Operation on bank detail',
}

export default BankDetailRoutes
