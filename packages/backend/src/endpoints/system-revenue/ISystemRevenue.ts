import ITimestamp from '../../libs/types/ITimestamp'
import IUser from '../user/IUser'

interface ISystemRevenue extends ITimestamp {
  admin: IUser['_id'] // Stakeholder admin uid
  type: string // Incase stakeholder withdraw fund to help track how much the system have
  reference: string // In the format: `CollectionName::collectionField:::fieldValue` if any
  amount: number
  description: string
}

export default ISystemRevenue
