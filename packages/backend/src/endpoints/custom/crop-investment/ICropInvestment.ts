import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface ICropInvestment extends ITimestamp {
  uid: IUser['_id']
  name: string
  description: string
  pricePerUnit: number
  minUnits: number
  roi: number
  closingDate: Date
  maturityDate: Date
  expenses: string[]
  assets: string[]
}
