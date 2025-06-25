import { SERVER_UNDER_MAINTENANCE } from '../configs/errorCodeConstants'
import { SERVICE_UNAVAILABLE } from '../configs/statusCodeConstants'
import BaseController from '../libs/controller/BaseController'
import Sender from '../libs/controller/Sender'
import RequestException from './base/RequestException'

class MaintenanceException extends RequestException {
  constructor(controller: BaseController | Sender, message?: string) {
    super(controller, message || 'Server under maintenance try again shortly')
    this.sendSignal.connection.statusCode = SERVICE_UNAVAILABLE
    this.sendSignal.connection.errorCode = SERVER_UNDER_MAINTENANCE
  }
}

export default MaintenanceException
