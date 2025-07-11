import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { getAttributes } from '../../libs/models/Attribute'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import User from './User'
import UserModel from './UserModel'
import UserProfileModel from './UserProfileModel'

const UserRoutes: IControllerRoute = {
  baseUrl: '/user',
  routes: [
    {
      path: '/send-verification-mail/:email',
      fields: {
        param: {
          email: {
            type: 'string',
            description: 'Email address to send verification code',
            example: 'example@gmail.com',
          },
        },
      },
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
      fields: {
        param: {
          email: {
            type: 'string',
            description: 'Email address to send forget password code',
            example: '',
          },
        },
      },
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
      fields: {
        param: {
          email: {
            type: 'string',
            description: 'Email address to send OTP',
            example: '',
          },
        },
      },
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
      fields: {},
      metadata: {
        summary: 'Check if current user is still logged in',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Query string to filter users',
            example: 'name=John',
          },
        },
      },
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
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Query string to filter user profiles',
            example: 'name=John',
          },
        },
      },
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to get user by Id',
            example: '1234567890',
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to get user profile by Id',
            example: '1234567890',
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to get user details by Id',
            example: '1234567890',
          },
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
      fields: {
        body: {
          email: {
            type: 'string',
            description: 'Email address of the user',
            example: 'example@gmail.com',
          },
          password: {
            type: 'string',
            description: 'Password of the user',
            example: 'password123',
          },
        },
      },
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
      fields: {
        body: {
          uid: {
            type: 'number',
            description: 'User Id',
            example: '',
          },
          email: {
            type: 'string',
            description: 'Email address to verify',
            example: '',
          },
          code: {
            type: 'string',
            description: 'Verification code sent to the email',
            example: '123456',
          },
        },
      },
      validation: {
        body: {
          //uid: { notEmpty: {} },
          email: { notEmpty: {} },
          code: { notEmpty: {} },
        },
      },
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
      fields: {
        body: {
          email: {
            type: 'string',
            description: 'Email address to verify',
            example: '',
          },
          code: {
            type: 'string',
            description: 'Verification code sent to the email',
            example: '123456',
          },
          newPassword: {
            type: 'string',
            description: 'New password for the user',
            example: 'newpassword123',
          },
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
      fields: {
        body: {
          oldPassword: {
            type: 'string',
            description: 'Current password of the user',
            example: 'oldpassword123',
          },
          newPassword: {
            type: 'string',
            description: 'New password for the user',
            example: 'newpassword123',
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/change-pin',
      controllerMemberFunctionIdentifier: User.prototype.changePin as any,
      method: RequestMethods.POST,
      fields: {
        body: {
          otp: {
            type: 'number',
            description: 'OTP to verify the user',
            example: '123456',
          },
          pin: {
            type: 'string',
            description: 'New PIN for the user',
            example: '5678',
          },
        },
      },
      validation: {
        body: {
          otp: { notEmpty: {} },
          pin: { notEmpty: {} },
        },
      },
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
      fields: {
        body: {
          pin: {
            type: 'string',
            description: 'PIN for the user',
            example: '1234',
          },
          password: {
            type: 'string',
            description: 'Password of the user',
            example: 'password123',
          },
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
      fields: {
        body: getAttributes(UserModel),
      },
    },

    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(UserModel),
      },
      metadata: {
        summary: 'Update user',
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },

    {
      path: '/user-profile',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(UserProfileModel),
      },
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to delete user by Id',
            example: '1234567890',
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
      fields: {
        param: {
          uid: {
            type: 'string',
            description: 'User ID to delete user profile by Id',
            example: '1234567890',
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
