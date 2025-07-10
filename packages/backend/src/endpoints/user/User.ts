import UserModel from './UserModel'
import UserProfileModel from './UserProfileModel'
import Authenticate from '../../libs/Authenticate'
import { getDefinedValuesFrom, getUser } from '../../common'
import { NextFunction, Request, Response } from 'express'
import { ACTIVE, AuthenticationLevel, HOTLISTED, INACTIVE, MIN } from '../../configs/constants'
import Mailer from '../../libs/Mailer'
import UserEmailAuthenticationModel from './UserEmailAuthenticationModel'
import IUser from './IUser'
import WalletModel from '../wallet/WalletModel'
import {
  BAD_AUTHENTICATION,
  BAD_AUTHORIZATION,
  BAD_REQUEST,
  GET_SUCCESS,
  NOT_FOUND,
  POST_SUCCESS,
  SERVICE_UNAVAILABLE,
} from '../../configs/statusCodeConstants'
import {
  ALREADY_VERIFIED,
  EXPIRED_CONFIRMATION_CODE,
  INVALID_CONFIRMATION_CODE,
  INVALID_REFID,
  SENDMAIL_ERROR,
  UNVERIFIED,
  USER_NOTFOUND,
  USER_SUSPENDED,
} from '../../configs/errorCodeConstants'
import PaginatingModel from '../../libs/models/PaginatingModel'
import FileStore from '../../libs/FileStore'
import { randomInt } from 'crypto'
import CountrieModel from '../countrie/CountrieModel'
import StateModel from '../state/StateModel'
import SharedConfig from '../../libs/SharedConfig'
import passport, { Profile } from 'passport'
import { Strategy } from 'passport-google-oauth2'
import IUserProfile from './IUserProfile'
import { RESET_PASSWORD, SCHEME, SIGNIN } from '../../configs/HybridAppRoutePaths'
import BaseController from '../../libs/controller/BaseController'
import TransactionModel from '../transaction/TransactionModel'
import md5 from '../../libs/md5'

class User extends BaseController {
  private oauth2: Profile | null = null

  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async logged() {
    this.status(true).message('Logged').send()
  }

  async login({ email, password }: any) {
    password = md5(password)
    let isAdmin
    if (await new Authenticate(this.req).verify()) {
      this.user = getUser(this.req) as IUser
      isAdmin = await this.adminAccess(false)
    }
    let user: UserModel | null = null
    if (isAdmin) {
      user = await UserModel.findOne({
        where: { email },
      })
    } else if (this.oauth2) {
      user = await UserModel.findOne({
        where: { email: this.oauth2.emails![0]?.value },
      })
    } else {
      user = await UserModel.findOne({
        where: { email, password },
      })
    }
    if (!user) {
      if (isAdmin) {
        return await this.statusCode(NOT_FOUND)
          .errorCode(USER_NOTFOUND)
          .error(`A user with email: ${email} does not exist`)
          .send()
      } else {
        return await this.statusCode(BAD_AUTHENTICATION)
          .error(this.oauth2 ? 'Could not verify your account try again shortly' : 'Invalid credentials.')
          .send()
      }
    } else {
      if (isAdmin || user.status === ACTIVE) {
        const authenticate = new Authenticate(this.req)
        const token = authenticate.generateToken({
          ...user.dataValues,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          uid: user._id,
          pin: user.pin ? '****' : '',
          password: '****',
        })
        const message = 'Logged in'
        if (this.oauth2) {
          return this.res.redirect(
            SCHEME + SIGNIN + encodeURIComponent(token) + '/' + ACTIVE + '/' + encodeURIComponent(message),
          )
        } else {
          return await this.status(true).message(message).setData(token).uid(user._id).send()
        }
      } else if (user.status === HOTLISTED) {
        const message = 'Account suspended for policy violation'
        if (this.oauth2) {
          return this.res.redirect(
            SCHEME + SIGNIN + encodeURIComponent(' ') + '/' + HOTLISTED + '/' + encodeURIComponent(message),
          )
        } else {
          return await this.statusCode(BAD_AUTHORIZATION).errorCode(USER_SUSPENDED).error(message).send()
        }
      } else {
        const message = 'Please verify your email'
        if (this.oauth2) {
          return this.res.redirect(
            SCHEME + SIGNIN + encodeURIComponent(' ') + '/' + INACTIVE + '/' + encodeURIComponent(message),
          )
        } else {
          return await this.statusCode(BAD_AUTHENTICATION).errorCode(UNVERIFIED).error(message).send()
        }
      }
    }
  }

  async get({ uid }: any): Promise<void> {
    await this.ownerAndAdminAccess(uid)
    const user = await UserModel.findByPk(uid)
    if (!user) this.status(false).statusCode(NOT_FOUND).message('User not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(user).send()
  }

  async getProfile({ uid }: any): Promise<void> {
    await this.ownerAndAdminAccess(uid)
    const userProfile = await UserProfileModel.findOne({ where: { uid } })
    if (!userProfile) this.status(false).statusCode(NOT_FOUND).message('User not found').send()
    else this.status(true).setData(userProfile).statusCode(GET_SUCCESS).send()
  }

  async getDetails({ uid }: any): Promise<void> {
    if (!uid) {
      uid = this?.user?._id
    }
    const user = await UserModel.findByPk(uid)
    if (!user) {
      return this.status(false).statusCode(NOT_FOUND).message('User not found').send()
    }
    const userProfile = await UserProfileModel.findOne({ where: { uid } })
    const country = userProfile?.country && (await CountrieModel.findAll({ where: { _id: userProfile.country } }))
    const state = userProfile?.state && (await StateModel.findAll({ where: { _id: userProfile.state } }))
    const details = {
      ...userProfile?.dataValues,
      ...user?.dataValues,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      uid: user._id,
      state,
      country,
      pin: user.pin ? '****' : '',
      password: '****',
    }
    this.status(true)
      .statusCode(GET_SUCCESS)
      .setData({ ...details, dob: uid === this.user._id ? details.dob : '' })
      .send()
  }

  async all() {
    const users = await new PaginatingModel<IUser>(UserModel, this).exec()
    if (!users) this.status(false).statusCode(NOT_FOUND).message('Users not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(users).send()
  }

  async profileAll() {
    await this.adminAccess()
    const userProfiles = await new PaginatingModel<IUserProfile>(UserProfileModel, this).exec()
    if (!userProfiles) this.status(false).statusCode(NOT_FOUND).message('Users not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(userProfiles).send()
  }

  async create({ firstname, lastname, email, password, type, refID }: any) {
    if (refID) {
      const referredBy = await UserModel.findOne({ where: { _id: refID } })
      if (!referredBy) {
        return await this.statusCode(BAD_REQUEST).errorCode(INVALID_REFID).message('Invalid referral ID').send()
      }
    }
    let user: UserModel | null = null
    if (this.oauth2) {
      const names = this.oauth2.displayName.split(' ')
      password = randomInt(1111111111, 9999999999)
      user = await UserModel.create({
        firstname: names[0],
        lastname: names[0],
        email: this.oauth2?.emails![0]?.value,
        oauth: true,
        password,
        status: ACTIVE,
      })
    } else {
      user = await UserModel.create({
        firstname,
        lastname,
        email,
        password,
        type,
        refID,
        status: INACTIVE,
      })
    }
    await UserProfileModel.create({ uid: user._id })
    await WalletModel.create({ uid: user._id })

    new Mailer()
      .setSubject('Welcome')
      .addRecipient({ name: user.firstname, address: user.email })
      .setBody(SharedConfig.get('WELCOME_TEMPLATE'), SharedConfig.get('SITE_URL'), 'Learn more')
      .send()

    if (!this.oauth2) {
      new Mailer()
        .setSubject('Email Verification')
        .addRecipient({ name: user.firstname, address: user.email })
        .setBody(
          `
    <h2>Confirmation Code</h2>
    <p>Here is your confirmation code to get your account opened, if you did not initiated this request kindly ignore this message.</p>
    `,
          '#',
        )
        .sendConfirmationCode()
    } else {
      new Mailer()
        .setSubject('Login credential')
        .addRecipient({ name: user.firstname, address: user.email })
        .setBody(
          `
    <h2>Account Creation with Google</h2>
    <p>Here is your login credential kindly change your password.</p>
    <p>
      <b>Username/Email</b>: ${user.email}<br/> 
      <b>Password</b>: ${password} <br />
    </p>
    `,
          SharedConfig.get('SITE_URL') || '#',
        )
        .send()
    }

    if (this.oauth2) {
      return await this.login({})
    }

    return await this.statusCode(POST_SUCCESS)
      .success('Account Created. Check your mailbox for confirmation code')
      .uid(user._id)
      .send()
  }

  async update() {
    let avatar
    let filestore = new FileStore(this)
    if (this.req.headers['content-type']?.includes('multipart')) {
      const temp = await filestore.uploadFor('avatar')
      avatar = temp?.avatar
    }
    const { refID, verifiedUser, verifiedDriver } = this.req.body

    const adminUpdate = (await this.adminAccess(false))
      ? {
          refID,
          verifiedUser,
          verifiedDriver,
        }
      : {}
    const { uid, firstname, lastname, email, expoToken, role, bio, country, state, phone, type, status }: any =
      this.req.body
    const theUser = await this.isValidUser(uid)
    await this.ownerAndAdminAccess(uid)
    const definedValues = getDefinedValuesFrom({
      firstname,
      lastname,
      email,
      expoToken,
      avatar,
      type,
      role: (await this.adminAccess(false))
        ? role === AuthenticationLevel.DEVELOPER
          ? (await this.developerAccess(false))
            ? AuthenticationLevel.DEVELOPER
            : AuthenticationLevel.END_USER
          : role === AuthenticationLevel.ADMIN
          ? AuthenticationLevel.ADMIN
          : AuthenticationLevel.END_USER
        : AuthenticationLevel.END_USER,
      status: (await this.adminAccess(false)) ? status : ACTIVE,
      ...adminUpdate,
    })

    if (avatar && theUser?.avatar) {
      filestore?.delete(theUser?.avatar)
    }

    const userInfoUpdate = await UserModel.update(definedValues, {
      where: { _id: uid },
      returning: true,
    })

    const profile = getDefinedValuesFrom({
      bio: bio?.substring(0, 100),
      country,
      state,
      phone,
    })

    const existingProfile = await UserProfileModel.findOne({ where: { uid } })
    if (existingProfile) {
      await UserProfileModel.update(profile, {
        where: { uid },
        returning: true,
      })
    } else {
      await UserProfileModel.create({ uid, ...profile })
    }

    return await this.getDetails({})
  }

  async changePassword({ uid, oldPassword, newPassword }: any) {
    oldPassword && (oldPassword = md5(oldPassword))
    const user = await this.isValidUser(uid)

    !this.directRequest && (await this.ownerAndAdminAccess(uid))

    const definedValues = getDefinedValuesFrom({
      password: newPassword,
    })

    const userInfoUpdate = await UserModel.update(definedValues, {
      where:
        (this.directRequest && !oldPassword) || !user?.password ? { _id: uid } : { _id: uid, password: oldPassword },
      returning: true,
    })

    if (!this.directRequest) {
      return userInfoUpdate[1]?.length ? userInfoUpdate[1][0] : false
    }

    if (!userInfoUpdate[1]?.length) {
      return await this.statusCode(BAD_REQUEST).error('Incorrect password!').send()
    } else {
      return await this.statusCode(POST_SUCCESS)
        .success('Password changed')
        .uid(userInfoUpdate[1][0]._id)
        .setData(userInfoUpdate[1][0])
        .send()
    }
  }

  async changePin({ uid, otp, pin }: any) {
    uid = uid || this?.user?._id
    await this.isValidUser(uid)
    await this.ownerAndAdminAccess(uid)

    const auth = await UserEmailAuthenticationModel.findOne({
      where: { uid, code: otp },
    })

    if (!auth) {
      return await this.statusCode(BAD_REQUEST).errorCode(INVALID_CONFIRMATION_CODE).error('Invalid OTP').send()
    }

    const exDuration = Date.now() - auth.duration

    if (exDuration > MIN * 10) {
      auth.destroy()
      return await this.statusCode(BAD_REQUEST).errorCode(EXPIRED_CONFIRMATION_CODE).error('OTP Expired').send()
    }

    const definedValues = getDefinedValuesFrom({
      pin,
    })

    const [_, updated] = await UserModel.update(definedValues, {
      where: { _id: uid },
      returning: true,
    })

    auth.destroy()

    if (!this.directRequest) {
      return updated?.length ? updated[0] : false
    }

    return await this.statusCode(POST_SUCCESS).success('Pin changed').setData(updated[0]).send()
  }

  async createPin({ uid, pin, password }: any) {
    password = md5(password)
    await this.isValidUser(uid)
    await this.ownerAccess(uid)

    const found = await UserModel.findOne({ where: { _id: uid, password } })

    if (!found) return await this.statusCode(NOT_FOUND).errorCode(USER_NOTFOUND).message('Incorrect password').send()

    found.set('pin', pin)
    await found.save()

    return await this.statusCode(POST_SUCCESS).success('Pin created').send()
  }

  async sendForgetPasswordMail({ email }: any) {
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      return await this.statusCode(NOT_FOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else {
      const code = randomInt(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }

      const [record, created] = await UserEmailAuthenticationModel.findOrCreate({
        where: { uid: user._id },
        defaults: auth,
      })

      if (!created) {
        await UserEmailAuthenticationModel.update(auth, {
          where: { uid: user._id },
        })
      }

      const resetLink =
        SharedConfig.get('SITE_URL') + RESET_PASSWORD.replace(':code:', `${code}`).replace(':email:', email)
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('Forgot Password Verification')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Forgot Password Verification Code</h2>
        <p>Here is your verification code to change your password, if you did not initiate this request kindly ignore/delete this message.</p>
        `,
          resetLink,
          resetLink,
        )
        .send(false)
      if (sent.status) {
        return await this.statusCode(GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send()
      } else {
        return await this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send verification code to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async verifyForgetPassword({ email, code, newPassword }: any) {
    const result = await UserEmailAuthenticationModel.findOne({
      where: { email, code },
    })

    if (!result) {
      return await this.statusCode(BAD_REQUEST)
        .errorCode(INVALID_CONFIRMATION_CODE)
        .error('Wrong Email or Confirmation Code')
        .send()
    } else {
      const exDuration = Date.now() - result?.duration
      if (exDuration > MIN * 10) {
        result.destroy()
        return await this.statusCode(BAD_REQUEST)
          .errorCode(EXPIRED_CONFIRMATION_CODE)
          .error('Confirmation Code Expired')
          .send()
      } else {
        result.destroy()
        const user = await UserModel.findOne({ where: { email } })
        this.directRequest = true
        const changed = await this.changePassword({
          uid: user?._id,
          newPassword,
        })
        this.directRequest = false
        if (changed) {
          return await this.statusCode(POST_SUCCESS).success('Password changed login and continue').send()
        } else {
          return await this.statusCode(BAD_REQUEST).error('Could not change your password try again').send()
        }
      }
    }
  }

  async sendVerificationMail({ email }: any) {
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      return await this.statusCode(NOT_FOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else if (user.status === ACTIVE) {
      return await this.statusCode(BAD_REQUEST).errorCode(ALREADY_VERIFIED).error('User Already verified').send()
    } else {
      const code = randomInt(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }
      try {
        const [record, created] = await UserEmailAuthenticationModel.findOrCreate({
          where: { uid: user._id },
          defaults: auth,
        })

        if (!created) {
          await UserEmailAuthenticationModel.update(auth, {
            where: { uid: user._id },
          })
        }
      } catch (error) {
        // Handle error if necessary
      }
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('Email Verification')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Email Verification Code</h2>
        <p>Here is your verification code to get your account opened, if you did not initiate this request kindly ignore this message.</p>
        `,
          'javascript:void;',
          `${code}`,
        )
        .send(false)
      if (sent.status) {
        return await this.statusCode(GET_SUCCESS).status(true).message(`Verification code sent to ${email}`).send()
      } else {
        return await this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send verification code to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async sendOtpMail({ email }: any) {
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      return await this.statusCode(NOT_FOUND).errorCode(USER_NOTFOUND).message('User Not Found').send()
    } else {
      const code = randomInt(123456, 987654)
      const auth = {
        uid: user._id,
        code,
        email,
        duration: Date.now(),
      }
      try {
        const [record, created] = await UserEmailAuthenticationModel.findOrCreate({
          where: { uid: user._id },
          defaults: auth,
        })

        if (!created) {
          await UserEmailAuthenticationModel.update(auth, {
            where: { uid: user._id },
          })
        }
      } catch (error) {
        // Handle error if necessary
      }
      const mailer = new Mailer()
      const sent = await mailer
        .setSubject('OTP Request')
        .addRecipient({ name: user.firstname, address: email })
        .setBody(
          `
        <h2>Authentication token</h2>
        <p>Here is your One Time Password Token, if you did not initiate this request kindly ignore this mail.</p>
        `,
          'javascript:void;',
          `${code}`,
        )
        .send(false)
      if (sent.status) {
        return await this.statusCode(GET_SUCCESS).status(true).message(`OTP sent to ${email}`).send()
      } else {
        return await this.statusCode(SERVICE_UNAVAILABLE)
          .errorCode(SENDMAIL_ERROR)
          .error(`Unable to send OTP to ${email}. Please try again shortly`)
          .send()
      }
    }
  }

  async verifyEmail({ uid, email, code }: any) {
    const result = await UserEmailAuthenticationModel.findOne({
      where: {
        email,
        uid,
        code,
      },
    })
    if (!result) {
      return await this.statusCode(BAD_REQUEST)
        .errorCode(INVALID_CONFIRMATION_CODE)
        .error('Wrong Email or Confirmation Code')
        .send()
    } else {
      const exDuration = Date.now() - result.duration
      if (exDuration > MIN * 10) {
        return await this.statusCode(BAD_REQUEST)
          .errorCode(EXPIRED_CONFIRMATION_CODE)
          .error('Confirmation Code Expired')
          .send()
      } else {
        let updatedUser
        if (uid) {
          updatedUser = await UserModel.update({ status: ACTIVE }, { where: { _id: uid }, returning: true })
        } else {
          updatedUser = await UserModel.update({ status: ACTIVE }, { where: { email }, returning: true })
        }
        if (!updatedUser[1]?.length) {
          return await this.statusCode(NOT_FOUND).error('User not found').send()
        }
        const user = updatedUser[1][0]
        const authenticate = new Authenticate(this.req)
        const token = authenticate.generateToken({
          ...(user as any),
          pin: '****',
          password: '****',
          uid: user._id,
        })
        return await this.statusCode(GET_SUCCESS)
          .success(`${user.firstname || uid} verified`)
          .uid(user._id)
          .setData(token)
          .send()
      }
    }
  }

  async googleOauth2() {
    const callbackURL = `${SharedConfig.get('API_URL')}`.trim() + '/main/v1/auth/verify'
    const client_id = process.env.GOOGLE_CLIENT_ID
    //const client_secret = process.env.GOOGLE_CLIENT_SECRET

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${client_id}&` +
      `redirect_uri=${encodeURIComponent(callbackURL)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('profile email')}&` +
      `access_type=offline&` +
      `prompt=consent`

    return await this.success().setData(authUrl).send()
  }

  async verifyGoogleOauth2() {
    const callbackURL = `${SharedConfig.get('API_URL')}`.trim() + '/main/v1/auth/verify'
    const client_id = process.env.GOOGLE_CLIENT_ID
    const client_secret = process.env.GOOGLE_CLIENT_SECRET

    passport.use(
      new Strategy(
        {
          clientID: client_id!,
          clientSecret: client_secret!,
          callbackURL, // Adjust this callback URL
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (_accessToken, _refreshToken, profile, _done) => {
          // This function handles the user data after successful Google authentication
          // Add your logic to create or retrieve a user in your database based on the Google profile
          // Example:

          this.oauth2 = profile
          const existingUser = await UserModel.findOne({
            where: { email: this.oauth2?.emails![0]?.value },
          })
          if (existingUser) {
            await this.login({})
          } else {
            await this.create({})
          }
        },
      ),
    )

    passport.authenticate('google', { scope: ['profile', 'email'] }, async (err: any) => {
      return await this.statusCode(BAD_AUTHENTICATION)
        .error(err?.message || `Could not verify your account`)
        .send()
    })(this.req, this.res, this.next)
  }

  async deleteProfile({ uid }: any): Promise<void> {
    await this.adminAccess()
    const deleted = await UserModel.destroy({ where: { _id: uid } })
    if (!deleted)
      this.status(false).statusCode(BAD_REQUEST).message('User Profile failed to be deleted do to error').send()
    else this.status(true).statusCode(POST_SUCCESS).message('User Profile deleted').setData(deleted).send()
  }

  async delete({ uid }: any): Promise<void> {
    await this.developerAccess()
    const deleted = await UserModel.destroy({ where: { _id: uid } })
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('User failed to be deleted due to error').send()
    } else {
      try {
        await TransactionModel.destroy({ where: { uid } })
        await UserEmailAuthenticationModel.destroy({ where: { uid } })
        await UserProfileModel.destroy({ where: { uid } })
      } catch (error) {
        // Handle errors if necessary
      }
      this.status(true).statusCode(POST_SUCCESS).message('User account deleted').send()
    }
  }
}

export default User
