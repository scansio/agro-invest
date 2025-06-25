import ITimestamp from "../../../libs/types/ITimestamp"
import IUser from "../../user/IUser"

interface IBankDetail extends ITimestamp {
  uid: IUser['_id']
  accountName: string
  accountNumber:string
  bankName: string
}

export default IBankDetail
