import { DataTypes, Model } from 'sequelize'
import IUserProfile from './IUserProfile'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import UserModel from './UserModel'

class UserProfileModel extends Model<IUserProfile, CreateType<IUserProfile>> {}

TimestampsPlugin(
  { UserProfileModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    country: {
      type: DataTypes.INTEGER,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: [7, 10],
      },
    },
    bio: {
      type: DataTypes.STRING,
    },
  },
)

export default UserProfileModel
