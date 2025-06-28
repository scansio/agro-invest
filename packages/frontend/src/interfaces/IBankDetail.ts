import ITimestamp from "./ITimestamp";
import IUser from "./IUser";

interface IBankDetail extends ITimestamp {
  uid: IUser["_id"];
  uidPopulated?: IUser;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export default IBankDetail;
