import { DataTypes, Model } from 'sequelize'
import IPaystackEventLog from './IPaystackEventLog'
import { CreateType } from '../../../libs/types/ITimestamp'
import TimestampsPlugin from '../../../libs/models/TimestampsPlugin'

interface PaystackEventLogModel extends IPaystackEventLog {}

class PaystackEventLogModel extends Model<IPaystackEventLog, CreateType<IPaystackEventLog>> {}

TimestampsPlugin(
  { PaystackEventLogModel },
  {
    raw: {
      type: DataTypes.STRING,
    },
  },
)

export default PaystackEventLogModel
