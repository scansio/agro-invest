import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { ILandInvestment } from './ILandInvestment'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'

interface LandInvestmentModel extends ILandInvestment {}

class LandInvestmentModel extends Model<ILandInvestment, CreateType<ILandInvestment>> {}

TimestampsPlugin(LandInvestmentModel, {
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
    type: DataTypes.TEXT,
    allowNull: false,
  },
  featureNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remainingUnits: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  minUnits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expenses: JsonField({
    allowNull: false,
  }),
  assets: JsonField({
    allowNull: false,
  }),
})

export default LandInvestmentModel
