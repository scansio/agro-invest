import { DataTypes, Model } from 'sequelize'
import UserProfileModel from '../user/UserProfileModel'
import ITeam from './ITeam'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import UserModel from '../user/UserModel'

class TeamModel extends Model<ITeam, CreateType<ITeam>> {}

TimestampsPlugin(
  { TeamModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    profileId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserProfileModel,
        key: '_id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default TeamModel
