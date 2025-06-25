import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'
import { IBusiness, IContentFormat, IDurations } from '../business/IBusiness'

export interface IAdvert extends ITimestamp {
  uid: IUser['_id']
  businessOwnerId: IUser['_id']
  businessId: IBusiness | IBusiness['_id']
  duration: IDurations['']
  contentFormat: IContentFormat['']
  amount: number
  rejected: boolean
  placementCompleted: boolean
  assets: string[]
  validationAssets: string[]
  campaignStartDate: string
  campaignEndDate: string
}
