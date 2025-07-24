import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface ICropInvestment extends ITimestamp {
  uid: IUser['_id']
  name: string
  description: string
  units: number
remainingUnits: number
  pricePerUnit: number
  minUnits: number
  roi: number
  closingDate: Date
  maturityDate: Date
  expenses: string[]
  featureNo: number
  assets: string[]
}
