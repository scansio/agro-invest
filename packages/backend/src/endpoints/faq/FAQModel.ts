import { DataTypes, Model } from 'sequelize'
import { IFAQ } from './IFAQ'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'

class FAQModel extends Model<IFAQ, CreateType<IFAQ>> {}

TimestampsPlugin(
  { FAQModel },
  {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
)

export default FAQModel
