import { DataTypes, Model } from 'sequelize'
import IOption from './IOption'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import { JsonField } from '../../common'

class OptionModel extends Model<IOption, CreateType<IOption>> {}

TimestampsPlugin(
  { OptionModel },
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: JsonField(),
    description: {
      type: DataTypes.STRING,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
)

export default OptionModel
