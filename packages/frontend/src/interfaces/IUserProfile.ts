import ITimestamp from "./ITimestamp";
import IUser from "./IUser";

interface IUserProfile extends ITimestamp {
  uid: IUser["_id"];
  uidPopulated?: IUser;
  country: number;
  state: number;
  phone: number;
  bio: string;
}
export default IUserProfile;
