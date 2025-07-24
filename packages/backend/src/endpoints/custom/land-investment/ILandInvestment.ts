import ITimestamp from '../../../libs/types/ITimestamp'
import IState from '../../state/IState'
import IUser from '../../user/IUser'

export interface ILandInvestment extends ITimestamp {
  uid: IUser['_id']
  name: string
  description: string
  address: string
  city: string
  state: IState['_id']
  pricePerUnit: number
  units: number
remainingUnits: number
  expenses: string[]
  featureNo: number
  assets: string[]
}
