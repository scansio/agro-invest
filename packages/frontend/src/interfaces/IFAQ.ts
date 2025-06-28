import ITimestamp from './ITimestamp'

export interface IFAQ extends ITimestamp {
  question: string
  answer: string
}
