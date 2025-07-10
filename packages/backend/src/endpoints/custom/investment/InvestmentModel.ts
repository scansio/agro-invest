import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { IInvestment } from './IInvestment'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

interface InvestmentModel extends IInvestment {}

class InvestmentModel extends Model<IInvestment, CreateType<IInvestment>> {}

TimestampsPlugin(
  { InvestmentModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investmentImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investmentModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investmentROI: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    earned: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
)

export default InvestmentModel
