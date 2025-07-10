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
      path: '/all',
      validation: { query: { q: {} } },
      controllerMemberFunctionIdentifier: BankDetail.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all bank details',
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
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get bank detail by id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/:uid([0-9]{8})',
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
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create bank detail',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update bank detail',
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
