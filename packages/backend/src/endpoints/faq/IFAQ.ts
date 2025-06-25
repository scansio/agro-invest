import ITimestamp from '../../libs/types/ITimestamp'

export interface IFAQ extends ITimestamp {
  question: string
  answer: string
}
