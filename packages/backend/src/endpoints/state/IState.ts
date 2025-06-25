import IDate from '../../libs/types/IDate'
import ITimestamp from '../../libs/types/ITimestamp'

interface IState extends ITimestamp {
  id: string
  name: string
  country_id: string
  country_code: string
  iso2: string
  created_at: IDate | Date | string
  updated_at: IDate | Date | string
}

export default IState
