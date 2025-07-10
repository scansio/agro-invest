import { DataTypes, Model } from 'sequelize'
import UserModel from '../../user/UserModel'
import { ILandInvestment } from './ILandInvestment'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'
import { JsonField } from '../../../common'
import StateModel from '../../state/StateModel'

interface LandInvestmentModel extends ILandInvestment {}

class LandInvestmentModel extends Model<ILandInvestment, CreateType<ILandInvestment>> {}

TimestampsPlugin(
  { LandInvestmentModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
    info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: StateModel,
        key: '_id',
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    assets: JsonField({
      allowNull: false,
    }),
  },
)

export default LandInvestmentModel
