import { AuthenticationLevel, UserType } from '../../configs/constants'
import ITimestamp from '../../libs/types/ITimestamp'

interface IUser extends ITimestamp {
  _id: number
  firstname: string
  lastname: string
  email: string
  password?: string
  role: AuthenticationLevel
  type: UserType
  dob: Date
  gender: string
  address: string
  refID: number
  pin?: string
  oauth: boolean
  verifiedUser: boolean
  verifiedDriver: boolean
  expoToken: String
  phone: number
  rating: number
  avatar: string
}

export default IUser
