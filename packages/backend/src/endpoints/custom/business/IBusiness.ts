import ITimestamp from '../../../libs/types/ITimestamp'
import IUser from '../../user/IUser'

export interface IEstimatedFootTraffic {
  daily: { min: number; max: number }
  weekly: { min: number; max: number }
  monthly: { min: number; max: number }
}

export interface IScreenDimension {
  tallOrY: number
  wideOrX: number
}

export interface IContentFormat {
  [key: string]: {
    title: string
    increaseInPercentage: number
    playMaxInSeconds: number
  }
}

export interface IMedia {
  screenType: string
  numberOfScreen: number
  screenDimension: IScreenDimension
  resolution: string
  contentFormat: IContentFormat
}

export interface IDurations {
  [key: string]: {
    title: string
    discountInPercentage: number
    numberOfDays: number
  }
}

export interface IBusiness extends ITimestamp {
  uid: IUser['_id']
  name: string
  serviceDescription: string
  state: string
  city: string
  address: string
  openingHours: string[]
  estimatedFootTraffic: IEstimatedFootTraffic
  targetAudience: string[]
  media: IMedia
  pricePerDay: number
  durations: IDurations
  assets: string[]
  ownershipType: string
  businessUrl: string
  businessType: string
}
