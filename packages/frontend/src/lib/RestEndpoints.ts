/* eslint-disable no-undef */
export const API_VERSION = "v1";

const isDev =
  String(process?.env.REBLEND_APP_ENVIRONMENT).toLowerCase() != "production";

export const BASE = new URL(window.location.origin);

if (isDev) {
  if (!process?.env.REBLEND_APP_BASE_DEV_PORT) {
    throw new Error("Please setup your environment: REBLEND_APP_BASE_DEV_PORT");
  }

  BASE.port = process?.env.REBLEND_APP_BASE_DEV_PORT;
}

if (!process?.env.REBLEND_APP_BASE) {
  throw new Error("Please setup your enviroment: REBLEND_APP_BASE");
}

BASE.pathname = process?.env.REBLEND_APP_BASE;

export const WS_BASE = new URL(window.location.origin);
if (WS_BASE.protocol.includes("s")) {
  WS_BASE.protocol = "wss";
} else {
  WS_BASE.protocol = "ws";
}
if (isDev) {
  if (!process?.env.REBLEND_APP_WS_BASE_DEV_PORT) {
    throw new Error(
      "Please setup your environment: REBLEND_APP_WS_BASE_DEV_PORT"
    );
  }

  WS_BASE.port = process?.env.REBLEND_APP_WS_BASE_DEV_PORT;
}

if (!process?.env.REBLEND_APP_WS_BASE) {
  throw new Error("Please setup your enviroment: REBLEND_APP_WS_BASE");
}

WS_BASE.pathname = process?.env.REBLEND_APP_WS_BASE;

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

//Custom endpoints

export const INVESTMENT = "/investment/";
export const CREATE_INVESTMENT = "/investment";
export const ALL_INVESTMENT = "/investment/all";

export const ANIMAL_INVESTMENT = "/animal-investment/";
export const CREATE_ANIMAL_INVESTMENT = "/animal-investment";
export const ALL_ANIMAL_INVESTMENT = "/animal-investment/all";

export const CROP_INVESTMENT = "/crop-investment/";
export const CREATE_CROP_INVESTMENT = "/crop-investment";
export const ALL_CROP_INVESTMENT = "/crop-investment/all";

export const CHICKEN_INVESTMENT = "/chicken-investment/";
export const CREATE_CHICKEN_INVESTMENT = "/chicken-investment";
export const ALL_CHICKEN_INVESTMENT = "/chicken-investment/all";

export const FARM_INVESTMENT = "/farm-investment/";
export const CREATE_FARM_INVESTMENT = "/farm-investment";
export const ALL_FARM_INVESTMENT = "/farm-investment/all";

export const LAND_INVESTMENT = "/land-investment/";
export const CREATE_LAND_INVESTMENT = "/land-investment";
export const ALL_LAND_INVESTMENT = "/land-investment/all";

export const HOT_INVESTMENT = "/hot-investment";
