import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
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
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get CropInvestment by id',
      },
    },
    {
      path: '/',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create CropInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/',
      method: RequestMethods.PATCH,
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
