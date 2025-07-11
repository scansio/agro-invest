import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Testimonial from './Testimonial'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import TestimonialModel from './TestimonialModel'
import { getAttributes } from '../../libs/models/Attribute'

const TestimonialRoutes: IControllerRoute = {
  tag: 'Testimonial',
  controller: Testimonial,
  baseUrl: '/testimonial',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for testimonials',
            example: 'Great service!',
          },
        },
      },
      controllerMemberFunctionIdentifier: Testimonial.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Testimonials',
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
            description: 'ID of the testimonial to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Testimonial by id',
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: getAttributes(TestimonialModel),
      },
      metadata: {
        summary: 'Create Testimonial',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(TestimonialModel),
      },
      metadata: {
        summary: 'Update Testimonial',
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
            description: 'ID of the testimonial to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete Testimonial',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: TestimonialModel.getAttributes(),
  model: TestimonialModel,
  description: 'Operation on development Testimonial',
}

export default TestimonialRoutes
