/* eslint-disable no-undef */
export const API_VERSION = "v1";

const isDev = String(process?.env.REBLEND_APP_ENVIRONMENT).toLowerCase() != "production"

export const BASE = isDev ? process?.env.REBLEND_APP_BASE_DEV : process?.env.REBLEND_APP_BASE;
export const WS_BASE = isDev ? process?.env.REBLEND_APP_WS_BASE_DEV : process?.env.REBLEND_APP_WS_BASE;

export const LOGIN = "/user/login";
export const USER_BASE = "/user";
export const CREATE_USER = "/user";
export const SEND_VERIFICATION_MAIL = "/user/send-verification-mail/";
export const SEND_FORGET_PASSWORD_MAIL = "/user/send-forget-password-mail/";
export const SEND_OTP_MAIL = "/user/send-otp-mail/";
export const VERIFY_MAIL = "/user/verify-mail";
export const VERIFY_FORGET_PASSWORD = "/user/verify-forget-password";
export const CHANGE_PASSWORD = "/user/change-password";
export const CHANGE_PIN = "/user/change-pin";
export const CREATE_PIN = "/user/create-pin";
export const ALL_USER = "/user/all";
export const ALL_USER_PROFILE = "/user-profile/all";
export const USER_DETAIL = "/user/detail/";

export const GENERATE_GAUTH = "/auth/google/";
export const GAUTH_VERIFY = "/auth/verify";

export const USER_SETTING = "/user-setting/";
export const CREATE_USER_SETTING = "/user-setting";
export const ALL_USER_SETTING = "/user-setting/all";

export const DEPOSIT = "/deposit";
export const GENERATE_DEPOSIT = "/deposit";

export const WITHDRAW = "/withdraw";
export const REQUEST_WITHDRAW = "/withdraw";

export const OPTION = "/option/";
export const CREATE_OPTION = "/option";
export const ALL_OPTION = "/option/all";

export const DATA_STORE_GET = "/data-store/get/";

export const SETTING_CATEGORY = "/setting-category/";
export const CREATE_SETTING_CATEGORY = "/setting-category";
export const ALL_SETTING_CATEGORY = "/setting-category/all";

export const SETTING = "/setting/";
export const CREATE_SETTING = "/setting";
export const ALL_SETTING = "/setting/all";

export const TRANSACTION = "/transaction/";
export const CREATE_TRANSACTION = "/transaction";
export const ALL_TRANSACTION = "/transaction/all";

export const ALL_COUNTRIE = "/countrie/all";

export const ALL_STATE = "/state/all";

export const LOGGED = "/user/logged";

export const WALLET = "/wallet";

export const WALLET_BALANCE = "/wallet/balance/";

export const UPDATE_TRANSACTION_HASH = "/transaction/hash";

export const CONFIRM_USER = "/wallet/confirm-user/";

export const TRANSFER = "/wallet/transfer";

export const PRIVATE_FILE = "/prf/";

export const PROFIT_TRANSACTION = "/profit-wallet/";
export const CREATE_PROFIT_TRANSACTION = "/profit-wallet";
export const ALL_PROFIT_TRANSACTION = "/transaction/profit/all";

export const SALES_TRANSACTION = "/referral-earning-transaction/";
export const CREATE_SALES_TRANSACTION = "/referral-earning-transaction";
export const ALL_SALES_TRANSACTION = "/sales-wallet/all";

export const SYSTEM_REVENUE = "/system-revenue/";
export const CREATE_SYSTEM_REVENUE = "/system-revenue";
export const ALL_SYSTEM_REVENUE = "/system-revenue/all";

export const PUBLIC_OPTIONS = "/option/publics";

export const DATASTORE = "/data-store/";
export const DATA_COUNT = "/data-store/count/";
export const DATA_SUM = "/data-store/sum/";

export const MIGRATION = "/migration/";
export const MIGRATION_NAMES = "/migration/names";
export const CREATE_MIGRATION = "/migration";
export const ALL_MIGRATION = "/migration/all";

//List endpoints
export const BANKDETAIL = "/bank-detail/";
export const CREATE_BANKDETAIL = "/bank-detail";
export const ALL_BANKDETAIL = "/bank-detail/all";
export const BANKDETAIL_VERIFY_ACCOUNT = "/bank-detail/verify-account-number";

export const BANK = "/bank/";
export const CREATE_BANK = "/bank";
export const ALL_BANK = "/bank/all";

export const BOOKEDRIDE = "/booked-ride/";
export const CREATE_BOOKEDRIDE = "/booked-ride";
export const ALL_BOOKEDRIDE = "/booked-ride/all";
export const START_BOOKEDRIDE = "/booked-ride/start/";
export const END_BOOKEDRIDE = "/booked-ride/end/";
export const CANCEL_BOOKEDRIDE = "/booked-ride/cancel/";
export const CUTCOST_BOOKEDRIDE = "/booked-ride/cut-cost/";

export const CANCELLEDBOOKEDRIDEREASON = "/cancelled-booked-ride-reason/";
export const CREATE_CANCELLEDBOOKEDRIDEREASON = "/cancelled-booked-ride-reason";
export const ALL_CANCELLEDBOOKEDRIDEREASON =
  "/cancelled-booked-ride-reason/all";

export const GARAGE = "/garage/";
export const CREATE_GARAGE = "/garage";
export const ALL_GARAGE = "/garage/all";

export const VERIFICATION = "/verification/";
export const CREATE_VERIFICATION = "/verification";
export const ALL_VERIFICATION = "/verification/all";
/* export const verification_send_email_verification_code = "/verification/send-email-verification-code";
 */
export const VERIFICATION_SEND_PHONE_VERIFICATION_CODE =
  "/verification/send-phone-verification-code/";
/* export const verification_verify_email = "/verification/verify-email/";
 */
export const VERIFICATION_VERIFY_PHONE = "/verification/verify-phone/";

export const DRIVER_VERIFICATION = "/driver-verification/";
export const CREATE_DRIVER_VERIFICATION = "/driver-verification";
export const ALL_DRIVER_VERIFICATION = "/driver-verification/all";

export const MESSAGE = "/message/";
export const CREATE_MESSAGE = "/message";
export const ALL_MESSAGE = "/message/all";
export const ALL_MESSAGE_WITH = "/message/all/with/";

export const CONVERSATION = "/conversation/";
export const CREATE_CONVERSATION = "/conversation";
export const ALL_CONVERSATION = "/conversation/all";
export const CONVERSATION_WITH = "/conversation/peer/";
export const MESSAGES_WITH_PEER_BY_CONVERSATION = "/conversation/messages/";

export const PAYMENTDISPUTE = "/payment-dispute/";
export const CREATE_PAYMENTDISPUTE = "/payment-dispute";
export const ALL_PAYMENTDISPUTE = "/payment-dispute/all";

export const PAYSTACKEVENTLOG = "/paystack-event-log/";
export const CREATE_PAYSTACKEVENTLOG = "/paystack-event-log";
export const ALL_PAYSTACKEVENTLOG = "/paystack-event-log/all";

export const PROFITWALLET = "/profit-wallet/";
export const CREATE_PROFITWALLET = "/profit-wallet";
export const ALL_PROFITWALLET = "/profit-wallet/all";
export const ALL_PROFITWALLET_TRANSACTION = "/transaction/profit/all";
export const PROFITWALLET_WITHDRAWABLE = "/profit-wallet/withdrawable/";
export const PROFITWALLET_TRANSFER = "/profit-wallet/transfer";

export const RATING = "/rating/";
export const CREATE_RATING = "/rating";
export const ALL_RATING = "/rating/all";

export const NOTIFICATION = "/notification/";
export const CREATE_NOTIFICATION = "/notification";
export const ALL_NOTIFICATION = "/notification/all";

export const RIDEDISPUTE = "/dispute/";
export const CREATE_RIDEDISPUTE = "/dispute";
export const ALL_RIDEDISPUTE = "/dispute/all";
export const CLEAR_RIDEDISPUTE = "/dispute/clear";

export const RIDEDISPUTESHAREDCOST = "/ride-dispute-shared-cost/";
export const CREATE_RIDEDISPUTESHAREDCOST = "/ride-dispute-shared-cost";
export const ALL_RIDEDISPUTESHAREDCOST = "/ride-dispute-shared-cost/all";

export const RIDE = "/ride/";
export const CREATE_RIDE = "/ride";
export const ALL_RIDE = "/ride/all";
export const START_RIDE = "/ride/start/";
export const END_RIDE = "/ride/end/";
export const CANCEL_RIDE = "/ride/cancel/";
export const NEARBY_RIDE = "/ride/nearby-rides";
export const FROMTO_RIDE = "/ride/from-and-to";
export const ACCEPT_BOOKED_RIDE = "/ride/booked/accept/";
export const REJECT_BOOKED_RIDE = "/ride/booked/reject/";

export const TEAM = "/team/";
export const CREATE_TEAM = "/team";
export const ALL_TEAM = "/team/all";
export const TEAM_MEMBER = "/team/:firstname-:lastname";

export const VERIFIEDUSER = "/verified-user/";
export const CREATE_VERIFIEDUSER = "/verified-user";
export const ALL_VERIFIEDUSER = "/verified-user/all";
export const IS_DRIVER_VERIFIED = "/is-driver-verified/";
export const IS_USER_VERIFIED = "/is-verified/";

export const SUPPORTUSER = "/supportuser/";
export const CREATE_SUPPORTUSER = "/supportuser";
export const ALL_SUPPORTUSER = "/supportuser/all";

export const REFERRAL_EARNING = "/referral-earning/";
export const CREATE_REFERRAL_EARNING = "/referral-earning";
export const ALL_REFERRAL_EARNING = "/referral-earning/all";

//TEMPLATE
export const NOTIFICATIOI = "/notification/";
export const CREATE_NOTIFICATIOI = "/notification";
export const ALL_NOTIFICATIOI = "/notification/all";
