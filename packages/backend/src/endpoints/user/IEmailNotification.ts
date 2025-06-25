import { Recipient } from '../../libs/Mailer'
import { AttachmentLike } from 'nodemailer/lib/mailer'
import ITimestamp from '../../libs/types/ITimestamp'

export default interface IEmailNotification extends ITimestamp {
  from: string
  to: string
  subject: string
  header: string
  body: string
  html: string
  replyTo: string
  headers: string
  recipients: Recipient[]
  attachments: AttachmentLike[]
  call2Action: string
  call2ActionText: string
  complimentary: string
  senderName: string
}
