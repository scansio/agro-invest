import IUser from './IUser'
import ITimestamp from './ITimestamp'
import { TransactionMode, TransactionType } from '../lib/contants'

interface ITransaction extends ITimestamp {
  uid: IUser['_id']
  uidPopulated?: IUser
  currency: string
  amount: number
  charge: number
  extra: string
  type: TransactionType
  mode: TransactionMode
  description: string
  reference: string
  callback_url: string
  rawJSONData: string[]
}

export default ITransaction
