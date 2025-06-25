import { DataTypes, Model } from 'sequelize'
import ICountrie from './ICountrie'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'

class CountrieModel extends Model<ICountrie, CreateType<ICountrie>> {}

TimestampsPlugin(
  { CountrieModel },
  {
    id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    iso3: {
      type: DataTypes.STRING,
    },
    numeric_code: {
      type: DataTypes.STRING,
    },
    phonecode: {
      type: DataTypes.STRING,
    },
    capital: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    currency_name: {
      type: DataTypes.STRING,
    },
    currency_symbol: {
      type: DataTypes.STRING,
    },
    region: {
      type: DataTypes.STRING,
    },
    subregion: {
      type: DataTypes.STRING,
    },
    emoji: {
      type: DataTypes.STRING,
    },
    emojiU: {
      type: DataTypes.STRING,
    },
    supported: {
      type: DataTypes.BOOLEAN,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
)

export default CountrieModel
