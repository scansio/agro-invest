import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { IAnimalInvestment } from './IAnimalInvestment'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

interface AnimalInvestmentModel extends IAnimalInvestment {}

class AnimalInvestmentModel extends Model<IAnimalInvestment, CreateType<IAnimalInvestment>> {}

TimestampsPlugin(
  { AnimalInvestmentModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
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
      allowNull: false,
    }),
    assets: JsonField({
      allowNull: false,
    }),
  },
)

export default AnimalInvestmentModel
