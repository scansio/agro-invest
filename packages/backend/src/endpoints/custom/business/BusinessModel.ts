import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { IBusiness } from './IBusiness'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

class BusinessModel extends Model<IBusiness, CreateType<IBusiness>> {}

TimestampsPlugin(
  { BusinessModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openingHours: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    estimatedFootTraffic: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    media: {
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
    assets: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    ownershipType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default BusinessModel
