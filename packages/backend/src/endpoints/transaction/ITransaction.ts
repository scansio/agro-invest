import IUser from '../user/IUser'
import ITimestamp from '../../libs/types/ITimestamp'
import { TransactionMode, TransactionType } from '../../configs/constants'

interface ITransaction extends ITimestamp {
  uid: IUser['_id']
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
