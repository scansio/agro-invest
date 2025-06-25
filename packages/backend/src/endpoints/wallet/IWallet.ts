import IUser from '../user/IUser'
import ITimestamp from '../../libs/types/ITimestamp'

interface IWallet extends ITimestamp {
  uid: IUser['_id']
}

export default IWallet
