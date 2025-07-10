import { DataTypes, Model } from 'sequelize'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import { JsonField } from '../../common'
import IUserEmailNotification from './IUserEmailNotification'
import { CreateType } from '../../libs/types/ITimestamp'

interface UserEmailNotificationModel extends IUserEmailNotification {}

class UserEmailNotificationModel extends Model<IUserEmailNotification, CreateType<IUserEmailNotification>> {}

TimestampsPlugin(
  { UserEmailNotificationModel },
  {
    from: {
      type: DataTypes.STRING,
    },
    to: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
    header: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    html: {
      type: DataTypes.STRING,
    },
    replyTo: {
      type: DataTypes.STRING,
    },
    headers: {
      type: DataTypes.STRING,
    },
    recipients: JsonField(),
    attachments: JsonField(),
    call2Action: {
      type: DataTypes.STRING,
    },
    call2ActionText: {
      type: DataTypes.STRING,
    },
    complimentary: {
      type: DataTypes.STRING,
    },
    senderName: {
      type: DataTypes.STRING,
    },
  },
)

export default UserEmailNotificationModel
