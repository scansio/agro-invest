import { AuthenticationLevel, RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import AnimalInvestment from './AnimalInvestment'
import AnimalInvestmentModel from './AnimalInvestmentModel'

const AnimalInvestmentRoutes: IControllerRoute = {
  tag: 'AnimalInvestment',
  controller: AnimalInvestment,
  baseUrl: '/animal-investment',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: AnimalInvestment.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all AnimalInvestments',
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
        summary: 'Get AnimalInvestment by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create AnimalInvestment',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update AnimalInvestment',
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
        summary: 'Delete AnimalInvestment',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: AnimalInvestmentModel.getAttributes(),
  model: AnimalInvestmentModel,
  description: 'Operation on AnimalInvestment',
}

export default AnimalInvestmentRoutes
