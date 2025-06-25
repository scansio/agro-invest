import ITimestamp from '../../../libs/types/ITimestamp'

interface IPaymentDispute extends ITimestamp {
  id: string
  event: string
  raw: string
  resolved: string
  reminded: number
}

export default IPaymentDispute
