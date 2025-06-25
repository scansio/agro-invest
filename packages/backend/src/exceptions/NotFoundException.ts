import { NOT_FOUND } from '../configs/statusCodeConstants'
import BaseController from '../libs/controller/BaseController'
import Sender from '../libs/controller/Sender'
import RequestException from './base/RequestException'
class NotFoundException extends RequestException {
  constructor(controller: BaseController | Sender, message?: string) {
    super(controller, message || 'Not found')
    this.sendSignal.connection.statusCode = NOT_FOUND
  }
}

export default NotFoundException
