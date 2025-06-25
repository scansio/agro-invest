import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import Testimonial from './Testimonial'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import TestimonialModel from './TestimonialModel'

const TestimonialRoutes: IControllerRoute = {
  tag: 'Testimonial',
  controller: Testimonial,
  baseUrl: '/testimonial',
  routes: [
    {
      path: '/testimonial/all',
      validation: { query: { q: {} } },
      controllerMemberFunctionIdentifier: Testimonial.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all Testimonials',
      },
    },
    {
      path: '/testimonial/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get Testimonial by id',
      },
    },
    {
      path: '/testimonial',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create Testimonial',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/testimonial',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update Testimonial',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/testimonial/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
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
