import md5 from '../md5'

export const SITE_TITLE = 'REACT STARTER'
export const MILLIS = 1 / 1000
export const SECOND = 1
export const MINUTE = 60
export const HOUR = 3600
export const DAY = 86400
export const WEEK = 604800
export const MONTH = 2_592_000
export const YEAR = 31_536_000
export const DECADE = 315_360_000
export const UID = md5(btoa('the5school_user_09074395694'))
export const A_UID = md5(btoa('the5school_admin_09074395694'))
export const C_UID = md5(btoa('the5school_creator_09074395694'))
export const CREATOR = 4
export const TEAM = 5
export const NGN = '₦'
export const USD = "<span><i class='fas fa-dollar'></i></span>"
export const ACTIVE = 1
export const INACTIVE = 0
export const PENDING_PUBLISH = 0
export const PUBLISHED = ACTIVE
export const HOTLISTED = 2
export const PUBLISH = PUBLISHED
export const UNPUBLISH = PENDING_PUBLISH
export const HOTLIST = HOTLISTED
export const UPDATE = 7
export const EDIT = 8
export const BEGINNER = 1
export const ADVANCE = 2
export const EXPERT = 3
export const APPROVED = 1
export const APPROVE = APPROVED
export const PENDING_APPROVAL = 3
export const SUSPENDED = 4
export const SUSPEND = SUSPENDED
export const APPROVAL_DECLINED = 5
export const APPROVAL_DECLINE = APPROVAL_DECLINED
export const UNVERIFIED = 0
export const LIMIT = 50
export const PERMANENT_DELETE = 6
export const READ = 9
export const ACCEPTANCE_FEE = 2.0
export const GAIN_FETCHING_FREQUENCY = 20000 //Millis
export const DATA_FETCH_LIMIT = 10

//Hotel Management
//Positions
export const RECEPTIONIST = 1
export const BARTENDER = 2
export const KITCHEN = 3
export const STORE_KEEPER = 4
export const RESTAURANT_ATTENDANT = 5

//Payment method
export const POS = 'pos'
export const TRANSFER = 'transfer'
export const CASH = 'cash'
export const COMMISSION = 'commission'

//Other
export const DEPARTMENT_BAR = 'Bar'
export const DEPARTMENT_STORE = 'Store'
export const DEPARTMENT_RESTAURANT = 'Restaurant'

//Booking
export const NOT_BOOKED = ACTIVE
export const BOOKED = PENDING_APPROVAL
