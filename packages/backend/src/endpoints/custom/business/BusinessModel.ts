import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { IBusiness } from './IBusiness'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

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
    openingHours: JsonField({
      allowNull: false,
    }),
    estimatedFootTraffic: JsonField({
      allowNull: false,
    }),
    targetAudience: JsonField({
      allowNull: false,
    }),
    media: JsonField({
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
    assets: JsonField({
      allowNull: false,
    }),
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
