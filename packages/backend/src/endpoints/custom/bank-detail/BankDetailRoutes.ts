import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import BankDetail from './BankDetail'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import BankDetailModel from './BankDetailModel'
import { getAttributes } from '../../../libs/models/Attribute'

const BankDetailRoutes: IControllerRoute = {
  tag: 'BankDetail',
  controller: BankDetail,
  baseUrl: '/bank-detail',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for bank details',
            example: 'Bank of America',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the bank detail to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'Unique identifier for the bank detail',
            example: '12345678',
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
      fields: {
        body: getAttributes(BankDetailModel),
      },
      metadata: {
        summary: 'Create bank detail',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(BankDetailModel) },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the bank detail to delete',
            example: '1234567890abcdef12345678',
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
