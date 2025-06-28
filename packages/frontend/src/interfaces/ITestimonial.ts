import ITimestamp from './ITimestamp'

export interface ITestimonial extends ITimestamp {
  personName: string
  personAvatar: string
  occupationOrPosition: string
  content: string
}
