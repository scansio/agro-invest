import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { BASE_PATH } from '../common'
import { IAPI } from '../libs/types/IAPI'
import {
  APIVersionStatus,
  AuthenticationLevel,
  GeoJSONType,
  TransactionMode,
  TransactionType,
  UserType,
} from '../configs/constants'
import CountrieRoutes from './countrie/CountrieRoutes'
import AdvertRoutes from './custom/advert/AdvertRoutes'
import WithdrawRoutes from './withdraw/WithdrawRoutes'
import WalletRoutes from './wallet/WalletRoutes'
import UserRoutes from './user/UserRoutes'
import AuthRoutes from './user/AuthRoutes'
import TransactionRoutes from './transaction/TransactionRoutes'
import TestimonialRoutes from './testimonial/TestimonialRoutes'
import TeamRoutes from './team/TeamRoutes'
import BankDetailRoutes from './custom/bank-detail/BankDetailRoutes'
import BusinessRoutes from './custom/business/BusinessRoutes'
import DataStoreRoutes from './data-store/DataStoreRoutes'
import DepositRoutes from './deposit/DepositRoutes'
import FAQRoutes from './faq/FAQRoutes'
import MigrationRoutes from './migration/MigrationRoutes'
import OptionRoutes from './option/OptionRoutes'
import PaymentDisputeRoutes from './paystack/payment-dispute/PaymentDisputeRoutes'
import PaystackEventLogRoutes from './paystack/paystack-event/PaystackEventLogRoutes'
import StateRoutes from './state/StateRoutes'
import SystemRevenueRoutes from './system-revenue/SystemRevenueRoutes'
import SocialAdvertRoutes from './custom/social-advert/SocialAdvertRoutes'
import SocialRoutes from './custom/social/SocialRoutes'

const API: IAPI = [
  {
    info: {
      title: 'AGROINVEST APP API',
      description: 'API for the AGROINVEST platform',
      version: 'v1',
      servers: ['/main'],
      status: APIVersionStatus.ENABLED,
      miscModel: {
        AuthenticationLevel,
        UserType,
        TransactionType,
        TransactionMode,
        GeoJSONType,
      },
    },
    controllerRoutes: [
      CountrieRoutes,
      AdvertRoutes,
      SocialAdvertRoutes,
      SocialRoutes,
      BankDetailRoutes,
      BusinessRoutes,
      DataStoreRoutes,
      DepositRoutes,
      FAQRoutes,
      MigrationRoutes,
      OptionRoutes,
      PaymentDisputeRoutes,
      PaystackEventLogRoutes,
      StateRoutes,
      SystemRevenueRoutes,
      TeamRoutes,
      TestimonialRoutes,
      TransactionRoutes,
      AuthRoutes,
      UserRoutes,
      WalletRoutes,
      WithdrawRoutes,
    ],
    status: APIVersionStatus.ENABLED,
  },
]

const APIDocPath = resolve(BASE_PATH, 'cdn', 'APIDoc.json')
const APIDoc = JSON.stringify(API)
writeFileSync(APIDocPath, APIDoc)

export default API
