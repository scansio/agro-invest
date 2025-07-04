import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { ISocial } from './ISocial'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

class SocialModel extends Model<ISocial, CreateType<ISocial>> {}

TimestampsPlugin(
  { SocialModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contentFormat: JsonField({
      allowNull: false,
    }),
    pricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    durations: JsonField({
      allowNull: false,
    }),
    estimatedTraffic: JsonField({
      allowNull: false,
    }),
    assets: JsonField({
      allowNull: false,
    }),
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default SocialModel
