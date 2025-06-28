import ITimestamp from "./ITimestamp";
import IUser from "./IUser";
import IUserProfile from "./IUserProfile";

interface ITeam extends ITimestamp {
  uid: IUser["_id"];
  profileId: IUserProfile["_id"];
  uidPopulated: IUser;
  profileIdPopulated: IUserProfile;
  title: string;
}

export default ITeam;
