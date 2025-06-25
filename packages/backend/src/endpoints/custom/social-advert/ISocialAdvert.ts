import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'
import { ISocial, IContentFormat, IDurations, IEstimatedTraffic } from '../social/ISocial'

export interface ISocialAdvert extends ITimestamp {
  uid: IUser['_id']
  socialOwnerId: IUser['_id']
  socialId: ISocial | ISocial['_id']
  duration: IDurations['']
  callToAction: string
  description: string
  targetAudience: string[]
  contentFormat: IContentFormat['']
  estimatedTraffic: IEstimatedTraffic['basic']
  amount: number
  rejected: boolean
  placementCompleted: boolean
  assets: string[]
  validationUrls: string[]
  campaignStartDate: string
  campaignEndDate: string
}
