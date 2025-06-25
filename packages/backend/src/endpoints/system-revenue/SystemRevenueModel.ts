import ISystemRevenue from './ISystemRevenue'
import { DataTypes, Model } from 'sequelize'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import UserModel from '../user/UserModel'

class SystemRevenueModel extends Model<ISystemRevenue, CreateType<ISystemRevenue>> {}

TimestampsPlugin(
  { SystemRevenueModel },
  {
    admin: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default SystemRevenueModel
