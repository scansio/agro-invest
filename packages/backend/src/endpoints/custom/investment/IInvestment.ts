import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface IInvestment extends ITimestamp {
  uid: IUser['_id']
  mode: 'active' | 'completed'
  investmentImageUrl: string
  investmentModel: string
  investmentId: string
  investmentName: string
  investmentROI: number
  unit: number
  value: number
  earned: number
}
