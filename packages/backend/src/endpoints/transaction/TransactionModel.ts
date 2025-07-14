import { DataTypes, Model } from 'sequelize'
import ITransaction from './ITransaction'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import UserModel from '../user/UserModel'
import { JsonField } from '../../common'

interface TransactionModel extends ITransaction {}

class TransactionModel extends Model<ITransaction, CreateType<ITransaction>> {}

TimestampsPlugin(
  { TransactionModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    charge: {
      type: DataTypes.FLOAT,
    },
    extra: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rawJSONData: JsonField(),
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    callback_url: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
)

export default TransactionModel
