import ITimestamp from '../../../libs/types/ITimestamp'
import IState from '../../state/IState'
import IUser from '../../user/IUser'

export interface ILandInvestment extends ITimestamp {
  uid: IUser['_id']
  info: string
  address: string
  city: string
  state: IState['_id']
  price: number
  assets: string[]
}
