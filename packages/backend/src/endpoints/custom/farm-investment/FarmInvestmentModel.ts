import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { IFarmInvestment } from './IFarmInvestment'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

interface FarmInvestmentModel extends IFarmInvestment {}

class FarmInvestmentModel extends Model<IFarmInvestment, CreateType<IFarmInvestment>> {}

TimestampsPlugin(
  { FarmInvestmentModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pricePerUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    closingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    maturityDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expenses: JsonField({
      allowNull: true,
    }),
    assets: JsonField({
      allowNull: false,
    }),
  },
)

export default FarmInvestmentModel
