import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import BusinessModel from '../business/BusinessModel'
import { IAdvert } from './IAdvert'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

class AdvertModel extends Model<IAdvert, CreateType<IAdvert>> {}

TimestampsPlugin(
  { AdvertModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    businessOwnerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    businessId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: BusinessModel,
        key: '_id',
      },
    },
    duration: JsonField({
      allowNull: false,
    }),
    contentFormat: JsonField({
      allowNull: false,
    }),
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    placementCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assets: JsonField({
      allowNull: false,
    }),
    validationAssets: JsonField({
      allowNull: true,
    }),
    campaignStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    campaignEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
)

export default AdvertModel
