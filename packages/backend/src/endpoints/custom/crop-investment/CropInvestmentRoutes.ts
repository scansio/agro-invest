import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { getAttributes } from '../../../libs/models/Attribute'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import CropInvestment from './CropInvestment'
import CropInvestmentModel from './CropInvestmentModel'

const CropInvestmentRoutes: IControllerRoute = {
  tag: 'Crop Investment',
  controller: CropInvestment,
  baseUrl: '/crop-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for CropInvestments',
            example: 'Investment in crops',
          },
        },
      },
      controllerMemberFunctionIdentifier: CropInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all CropInvestments',
      },
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
            description: 'ID of the CropInvestment to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get CropInvestment by id',
      },
    },
    {
      path: '/',
      method: RequestMethods.POST,
      fields: { body: getAttributes(CropInvestmentModel) },
      metadata: {
        summary: 'Create CropInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/',
      method: RequestMethods.PATCH,
      fields: { body: getAttributes(CropInvestmentModel) },
      metadata: {
        summary: 'Update CropInvestment',
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
            description: 'ID of the CropInvestment to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete CropInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: CropInvestmentModel.getAttributes(),
  model: CropInvestmentModel,
  description: 'Operation on CropInvestment',
}

export default CropInvestmentRoutes
