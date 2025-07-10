import ITimestamp from '../../libs/types/ITimestamp'

interface IUserEmailNotification extends ITimestamp {
  from: string
  to: string
  subject: string
  header: string
  body: string
  html: string
  replyTo: string
  headers: string
  recipients: any
  attachments: any
  call2Action: string
  call2ActionText: string
  complimentary: string
  senderName: string
}
export default IUserEmailNotification
