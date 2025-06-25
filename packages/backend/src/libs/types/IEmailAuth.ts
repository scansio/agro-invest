import ITimestamp from './ITimestamp'
import IUser from '../../endpoints/user/IUser'

export default interface IEmailAuth extends ITimestamp {
  uid: IUser['_id']
  email: string
  code: number
  extra: string
  duration: number
}
