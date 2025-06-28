/* eslint-disable no-undef */
export const API_VERSION = "v1";

const isDev =
  String(process?.env.REBLEND_APP_ENVIRONMENT).toLowerCase() != "production";

export const BASE = isDev
  ? process?.env.REBLEND_APP_BASE_DEV
  : process?.env.REBLEND_APP_BASE;
export const WS_BASE = isDev
  ? process?.env.REBLEND_APP_WS_BASE_DEV
  : process?.env.REBLEND_APP_WS_BASE;

export const IMAGE_BASE = BASE + "/..";
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
export const ADVERT = "/advert/";
export const CREATE_ADVERT = "/advert";
export const ALL_ADVERT = "/advert/all";

export const BUSINESS = "/business/";
export const CREATE_BUSINESS = "/business";
export const ALL_BUSINESS = "/business/all";

export const SOCIAL_ADVERT = "/social-advert/";
export const CREATE_SOCIAL_ADVERT = "/social-advert";
export const ALL_SOCIAL_ADVERT = "/social-advert/all";

export const SOCIAL = "/social/";
export const CREATE_SOCIAL = "/social";
export const ALL_SOCIAL = "/social/all";

export const TEAM = "/team/";
export const CREATE_TEAM = "/team";
export const ALL_TEAM = "/team/all";
export const TEAM_PREVIEW = "/team/preview/:firstname-:lastname";

export const BANK_DETAIL = "/bank-detail/";
export const CREATE_BANK_DETAIL = "/bank-detail";
export const ALL_BANK_DETAIL = "/bank-detail/all";

export const TESTIMONIAL = "/testimonial/";
export const CREATE_TESTIMONIAL = "/testimonial";
export const ALL_TESTIMONIAL = "/testimonial/all";

export const FAQ = "/faq/";
export const CREATE_FAQ = "/faq";
export const ALL_FAQ = "/faq/all";
