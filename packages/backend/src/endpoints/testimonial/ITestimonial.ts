import ITimestamp from '../../libs/types/ITimestamp'

export interface ITestimonial extends ITimestamp {
  content: string
  personName: string
  occupationOrPosition: string
  personAvatar: string
}
