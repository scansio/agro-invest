import { DataTypes, Model } from 'sequelize'
import TransactionModel from '../transaction/TransactionModel'
import { ACTIVE, TransactionMode, TransactionType } from '../../configs/constants'
import IWallet from './IWallet'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import UserModel from '../user/UserModel'

class WalletModel extends Model<IWallet, CreateType<IWallet>> {
  async getBalance() {
    let credit = 0
    let debit = 0

    const activeTransactions = await TransactionModel.findAll({
      where: { uid: this.dataValues.uid },
    })

    activeTransactions.forEach(({ dataValues: transaction }) => {
      if (transaction.status !== ACTIVE) return

      switch (transaction.type) {
        case TransactionType.PAYMENT:
        case TransactionType.DEPOSIT:
          if (transaction.mode === TransactionMode.SUCCESS) {
            credit += transaction.amount || 0
          }
          break

        case TransactionType.SYSTEM_CHARGE:
        case TransactionType.WITHDRAW:
        case TransactionType.CHARGE:
          debit += transaction.amount || 0
          break

        default:
          debit += transaction.amount || 0
          break
      }
    })

    return (credit / 100.0) * 100.0 - (debit / 100.0) * 100.0
  }
}

TimestampsPlugin(
  { WalletModel },
  {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: '_id',
      },
    },
  },
)

export default WalletModel
