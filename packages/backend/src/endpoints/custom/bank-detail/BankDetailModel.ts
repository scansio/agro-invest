import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import IBankDetail from './IBankDetail'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

class BankDetailModel extends Model<IBankDetail, CreateType<IBankDetail>> {}

TimestampsPlugin(
  { BankDetailModel },
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
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  [
    {
      model: UserModel,
      option: {
        foreignKey: 'uid', // The foreign key in BankDetailModel
        targetKey: '_id', // The primary key in UserModel
      },
    },
  ],
)

export default BankDetailModel
