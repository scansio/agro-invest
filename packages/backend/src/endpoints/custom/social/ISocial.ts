import { SocialPlatform } from '../../../configs/constants'
import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface IEstimatedTraffic {
  basic: {
    title: string
    min: number
    max: number
    increaseInPercentage: number
  }
  gold: {
    title: string
    min: number
    max: number
    increaseInPercentage: number
  }
  platinum: {
    title: string
    min: number
    max: number
    increaseInPercentage: number
  }
}

export interface IContentFormat {
  [key: string]: {
    title: string
    increaseInPercentage: number
    playMaxInSeconds: number
  }
}

export interface IDurations {
  [key: string]: {
    title: string
    discountInPercentage: number
    numberOfDays: number
  }
}

export interface ISocial extends ITimestamp {
  uid: IUser['_id']
  platform: SocialPlatform
  description: string
  pricePerDay: number
  contentFormat: IContentFormat
  estimatedTraffic: IEstimatedTraffic
  durations: IDurations
  assets: string[]
}
