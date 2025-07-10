import { DataTypes, Model } from 'sequelize'
import UserModel from './UserModel'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import IUserEmailAuthentication from './IUserEmailAuthentication'
import { CreateType } from '../../libs/types/ITimestamp'

interface UserEmailAuthenticationModel extends IUserEmailAuthentication {}

class UserEmailAuthenticationModel extends Model<IUserEmailAuthentication, CreateType<IUserEmailAuthentication>> {}

TimestampsPlugin(
  { UserEmailAuthenticationModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extra: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default UserEmailAuthenticationModel
