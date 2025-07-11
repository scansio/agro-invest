import { RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import User from './User'
import UserModel from './UserModel'

const AuthRoutes: IControllerRoute = {
  tag: 'Authentication',
  baseUrl: '/auth',
  controller: User,
  routes: [
    {
      path: '/google',
      controllerMemberFunctionIdentifier: User.prototype.googleOauth2,
      method: RequestMethods.GET,
      fields: {},
      metadata: {
        summary: 'Google Oauth2 generate authentication link',
      },
    },
    {
      path: '/verify',
      controllerMemberFunctionIdentifier: User.prototype.verifyGoogleOauth2,
      method: RequestMethods.GET,
      fields: {},
      metadata: {
        summary: 'Google Oauth2 verify authentication ',
      },
    },
  ],
  schema: UserModel.getAttributes(),
  model: UserModel,
  description: 'Google sign in',
}

export default AuthRoutes
