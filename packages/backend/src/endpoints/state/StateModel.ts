import { DataTypes, Model } from 'sequelize'
import IState from './IState'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'

interface StateModel extends IState {}

class StateModel extends Model<IState, CreateType<IState>> {}

TimestampsPlugin(
  { StateModel },
  {
    id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    country_id: {
      type: DataTypes.STRING,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    iso2: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.STRING,
    },
    updated_at: {
      type: DataTypes.STRING,
    },
  },
)

export default StateModel
