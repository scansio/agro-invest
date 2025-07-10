import node_paystack from '@aizon/node-paystack'
import { createHmac } from 'crypto'
import { config } from 'dotenv'
import IAny from './types/IAny'
import { Request, Response } from 'express'
import { ACTIVE, PaystackHookEvent, TransactionMode } from '../configs/constants'
import { SCHEME, TRANSACTION } from '../configs/HybridAppRoutePaths'
import OptionModel from '../endpoints/option/OptionModel'
import Mailer from './Mailer'
import IUser from '../endpoints/user/IUser'
import PaymentDisputeModel from '../endpoints/paystack/payment-dispute/PaymentDisputeModel'
import PaystackEventLogModel from '../endpoints/paystack/paystack-event/PaystackEventLogModel'
import TransactionModel from '../endpoints/transaction/TransactionModel'
import UserModel from '../endpoints/user/UserModel'

config()
const API_KEY = process.env.PAYSTACK_API_KEY

export async function paystackCallback(req: Request, res: Response) {
  const { reference = '' } = req.query || {}

  if (!reference) {
    return res.send('Invalid transaction Id')
  }

  const transactionModel = await TransactionModel.findOne({
    where: { reference: reference as string, status: ACTIVE },
    include: [{ model: UserModel, as: 'uidPopulated' }],
  })

  if (!transactionModel) {
    return res.send('Invalid transaction Id')
  }

  const verificationResult = await Paystack.transaction.verify(reference as any)
  if (verificationResult.status) {
    switch (verificationResult.data.status) {
      case 'success':
        transactionModel.set('mode', TransactionMode.SUCCESS) // Use set() method
        break
      case 'pending':
        transactionModel.set('mode', TransactionMode.PENDING)
        break
      case 'failed':
        transactionModel.set('mode', TransactionMode.FAILED)
        break
      case 'reversed':
        transactionModel.set('mode', TransactionMode.REVERSED)
        break
      default:
        break
    }
  }

  // Update rawJSONData field
  const rawJSONData: [] = (transactionModel.get('rawJSONData') as any) || []
  transactionModel.set('rawJSONData', [...rawJSONData, JSON.stringify(verificationResult)])

  // Save the changes to the database
  await transactionModel.save()

  const user = transactionModel.get('uidPopulated') as IUser

  new Mailer()
    .setSubject('Deposit Transaction')
    .addRecipient({ name: user.firstname, address: user.email })
    .setBody(
      `
        <h2>Deposit Confirmation</h2>
        <p>We have confirmed your deposit.</p>
        <p>Amount: ${transactionModel.get('currency')}${transactionModel.get('amount')}</p>
        <p>Reference: ${reference}</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
      '#',
    )
    .send()

  const frontendUrl = (await OptionModel.findOne({ where: { name: 'SITE_URL' } }))?.get('value') || SCHEME
  res.redirect(frontendUrl + TRANSACTION)
}

export function validatePaystackHook(req: Request, res: Response) {
  res.status(200).send('OK')

  setImmediate(() => {
    const hash = createHmac('sha512', API_KEY as string)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash === req.headers['x-paystack-signature']) {
      processhook(req.body as object)
      PaystackEventLogModel.create({ raw: JSON.stringify(req.body) })
    }
  })
}

async function processhook(responseData: IAny) {
  const fn = (func: (event: PaystackHookEvent, data: object) => void) => {
    func(responseData.event, responseData)
  }

  switch (responseData.event) {
    case PaystackHookEvent.TRANSACTION_SUCCESS:
      fn(processTransaction)
      break

    case PaystackHookEvent.TRANSFER_SUCCESS:
    case PaystackHookEvent.TRANSFER_FAILED:
    case PaystackHookEvent.TRANSFER_REVERSED:
      fn(processTransfers)
      break

    case PaystackHookEvent.PAYMENTREQUEST_SUCCESS:
    case PaystackHookEvent.PAYMENTREQUEST_PENDING:
    case PaystackHookEvent.CHARGE_DISPUTE_CREATE:
      fn(processPaymentRequest)
      break

    case PaystackHookEvent.CHARGE_DISPUTE_RESOLVE:
    case PaystackHookEvent.CHARGE_DISPUTE_REMIND:
      fn(processDispute)
      break

    default:
      break
  }
}

async function processTransfers(event: PaystackHookEvent, data: IAny) {
  const transaction = await TransactionModel.findOne({
    where: { reference: data.reference, status: ACTIVE },
  })

  switch (event) {
    case PaystackHookEvent.TRANSFER_SUCCESS:
      transaction && transaction.set('mode', TransactionMode.SUCCESS)
      break

    case PaystackHookEvent.TRANSFER_FAILED:
      transaction && transaction.set('mode', TransactionMode.FAILED)
      break

    case PaystackHookEvent.TRANSFER_REVERSED:
      transaction && transaction.set('mode', TransactionMode.REVERSED)
      break

    default:
      break
  }

  if (transaction) {
    transaction.set('rawJSONData', [...(transaction.rawJSONData || []), JSON.stringify(data)])
    await transaction.save()
  }
}

async function processTransaction(event: PaystackHookEvent, data: IAny) {
  const transaction = await TransactionModel.findOne({
    where: { reference: data.data.reference, status: ACTIVE },
  })

  if (event === PaystackHookEvent.TRANSACTION_SUCCESS && transaction) {
    transaction.set('mode', TransactionMode.SUCCESS)
    transaction.set('rawJSONData', [...(transaction.rawJSONData || []), JSON.stringify(data)])
    await transaction.save()
  }
}

async function processPaymentRequest(event: PaystackHookEvent, data: IAny) {
  switch (event) {
    case PaystackHookEvent.PAYMENTREQUEST_SUCCESS:
      // TODO: Handle payment request success
      break

    case PaystackHookEvent.PAYMENTREQUEST_PENDING:
      // TODO: Handle payment request pending
      break

    default:
      break
  }
}

async function processDispute(event: PaystackHookEvent, data: IAny) {
  const dispute = await PaymentDisputeModel.findOne({ where: { id: data.id } })

  switch (event) {
    case PaystackHookEvent.CHARGE_DISPUTE_CREATE:
      await PaymentDisputeModel.create({ id: data.id, event: data.event, raw: JSON.stringify(data) })
      break

    case PaystackHookEvent.CHARGE_DISPUTE_RESOLVE:
      if (dispute) {
        dispute.set('resolved', data.status)
        await dispute.save()
      }
      break

    case PaystackHookEvent.CHARGE_DISPUTE_REMIND:
      if (dispute) {
        dispute.set('reminded', (dispute.reminded || 0) + 1)
        await dispute.save()
      }
      break

    default:
      break
  }
}

export const Paystack = node_paystack(API_KEY || '')
