import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import User from './User'
import UserModel from './UserModel'

const UserRoutes: IControllerRoute = {
  baseUrl: '/user',
  routes: [
    {
      path: '/send-verification-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendVerificationMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send Verification Code to email',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },

    {
      path: '/send-forget-password-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendForgetPasswordMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send password reset email',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },

    {
      path: '/send-otp-mail/:email',
      controllerMemberFunctionIdentifier: User.prototype.sendOtpMail,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Send OTP',
      },
      validation: {
        param: {
          email: {
            isEmail: {},
          },
        },
      },
    },

    {
      path: '/logged',
      controllerMemberFunctionIdentifier: User.prototype.logged,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Check if current user is still logged in',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: User.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },

    {
      path: '/user-profile/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: User.prototype.profileAll,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all user profile',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },

    {
      path: '/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user by Id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/user-profile/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            notEmpty: {},
            isLength: { min: 10, max: 10 },
          },
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.getProfile,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get profile by user Id',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/detail/:uid([0-9]{10})?',
      validation: {
        param: {
          uid: {},
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.getDetails,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get user and there profile by user Id or without Id should fetch all',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/login',
      controllerMemberFunctionIdentifier: User.prototype.login,
      method: RequestMethods.POST,
      metadata: {
        summary: 'User login',
      },
      validation: {
        body: {},
      },
    },

    {
      path: '/verify-mail',
      controllerMemberFunctionIdentifier: User.prototype.verifyEmail,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Verify user email',
      },
    },

    {
      path: '/verify-forget-password',
      controllerMemberFunctionIdentifier: User.prototype.verifyForgetPassword,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Verify forget password',
      },
      validation: {
        body: {
          email: { notEmpty: {} },
          code: { notEmpty: {} },
          newPassword: { notEmpty: {} },
        },
      },
    },

    {
      path: '/change-password',
      controllerMemberFunctionIdentifier: User.prototype.changePassword as any,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Change user password',
      },
      validation: {
        body: {
          oldPassword: { notEmpty: {} },
          newPassword: { notEmpty: {} },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/change-pin',
      controllerMemberFunctionIdentifier: User.prototype.changePin as any,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Change user PIN',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/create-pin',
      controllerMemberFunctionIdentifier: User.prototype.createPin,
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user PIN',
      },
      validation: {
        body: {
          pin: {
            isLength: { min: 4, max: 4, message: 'Pin should be not be greater or less than 4' },
            isNumeric: {},
          },
          password: true,
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create user',
      },
    },

    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/user-profile',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update user profile',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            isLength: { min: 10, max: 10 },
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },

    {
      path: '/user-profile/:uid([0-9]{10})',
      validation: {
        param: {
          uid: {
            isLength: { min: 10, max: 10 },
          },
        },
      },
      controllerMemberFunctionIdentifier: User.prototype.deleteProfile,
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete user profile',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: UserModel.getAttributes(),
  model: UserModel,
  tag: 'User',
  description: 'Operation on User model',
  controller: User,
}

export default UserRoutes
