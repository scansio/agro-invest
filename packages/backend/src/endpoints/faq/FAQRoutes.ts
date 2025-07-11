import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import FAQ from './FAQ'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import FAQModel from './FAQModel'
import { getAttributes } from '../../libs/models/Attribute'

const FAQRoutes: IControllerRoute = {
  tag: 'FAQ',
  controller: FAQ,
  baseUrl: '/faq',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for FAQs',
            example: 'How to invest in agriculture?',
          },
        },
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the FAQ to retrieve',
            example: '1234567890abcdef12345678',
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
      fields: {
        body: getAttributes(FAQModel),
      },
      metadata: {
        summary: 'Create FAQ',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(FAQModel),
      },
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
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the FAQ to delete',
            example: '1234567890abcdef12345678',
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
