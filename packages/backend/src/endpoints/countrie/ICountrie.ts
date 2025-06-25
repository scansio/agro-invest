import IDate from '../../libs/types/IDate'
import ITimestamp from '../../libs/types/ITimestamp'

interface ICountrie extends ITimestamp {
  id: string
  name: string
  iso3: string
  numeric_code: string
  phonecode: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  region: string
  subregion: string
  emoji: string
  emojiU: string
  supported: boolean
  created_at: IDate | Date | string
  updated_at: IDate | Date | string
}

export default ICountrie
