import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface IFarmInvestment extends ITimestamp {
  uid: IUser['_id']
  description: string
  pricePerUnit: number
  minUnits: number
  roi: number
  closingDate: Date
  maturityDate: Date
  expenses: string[]
  assets: string[]
}
