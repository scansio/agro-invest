import ITimestamp from '../../libs/types/ITimestamp'
import IUser from '../user/IUser'
import IUserProfile from '../user/IUserProfile'

interface ITeam extends ITimestamp {
  uid: IUser['_id']
  profileId: IUserProfile['_id']
  title: string
}

export default ITeam
