import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import SocialModel from '../social/SocialModel'
import { ISocialAdvert } from './ISocialAdvert'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

class SocialAdvertModel extends Model<ISocialAdvert, CreateType<ISocialAdvert>> {}

TimestampsPlugin(
  { SocialAdvertModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    socialOwnerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    socialId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: SocialModel,
        key: '_id',
      },
    },
    duration: JsonField({
      allowNull: false,
    }),
    callToAction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    targetAudience: JsonField({
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
    validationUrls: JsonField({
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

export default SocialAdvertModel
