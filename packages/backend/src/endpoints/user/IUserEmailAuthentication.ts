import ITimestamp from '../../libs/types/ITimestamp'
import IUser from './IUser'

interface IUserEmailAuthentication extends ITimestamp {
  uid: IUser['_id']
  email: string
  code: number
  extra: string
  duration: number
}
export default IUserEmailAuthentication
