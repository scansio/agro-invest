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

export interface IAnimalInvestment extends ITimestamp {
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
