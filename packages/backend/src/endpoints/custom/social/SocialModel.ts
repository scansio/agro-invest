import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { ISocial } from './ISocial'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

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
    contentFormat: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    pricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    durations: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    estimatedTraffic: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    assets: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default SocialModel
