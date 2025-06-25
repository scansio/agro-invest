import { DataTypes, Model } from 'sequelize'
import IPaymentDispute from './IPaymentDispute'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

class PaymentDisputeModel extends Model<IPaymentDispute, CreateType<IPaymentDispute, 'resolved' | 'reminded'>> {}

TimestampsPlugin(
  { PaymentDisputeModel },
  {
    id: {
      type: DataTypes.STRING,
    },
    event: {
      type: DataTypes.STRING,
    },
    raw: {
      type: DataTypes.STRING,
    },
    resolved: {
      type: DataTypes.STRING,
    },
    reminded: {
      type: DataTypes.INTEGER,
    },
  },
)

export default PaymentDisputeModel
