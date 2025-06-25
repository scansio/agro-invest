import IPaginatingMetadata from './IPaginatingMetadata'
import ITimestamp, { GModel } from './ITimestamp'

interface IPaginating<T extends ITimestamp> {
  metadata: IPaginatingMetadata
  results: GModel<T>[]
}

export default IPaginating
