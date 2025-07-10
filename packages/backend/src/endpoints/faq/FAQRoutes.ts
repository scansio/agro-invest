import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import FAQ from './FAQ'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import FAQModel from './FAQModel'

const FAQRoutes: IControllerRoute = {
  tag: 'FAQ',
  controller: FAQ,
  baseUrl: '/faq',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      controllerMemberFunctionIdentifier: FAQ.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all FAQs',
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
        summary: 'Get FAQ by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create FAQ',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update FAQ',
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
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete FAQ',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: FAQModel.getAttributes(),
  model: FAQModel,
  description: 'Operation on Frequently Asked Question',
}

export default FAQRoutes
