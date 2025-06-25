import AllError from './AllError'
import { BAD_REQUEST } from '../../configs/statusCodeConstants'
import IResStruct from '../../libs/types/IResStruct'
import BaseController from '../../libs/controller/BaseController'
import Sender from '../../libs/controller/Sender'

class RequestException extends AllError {
  sendSignal: IResStruct
  constructor(controller: BaseController | Sender, message?: string) {
    super()
    this.message = message || 'Request failed'
    this.controller = controller
    this.controller.status(false).statusCode(BAD_REQUEST).message(this.message)
    this.sendSignal = {
      connection: this.controller.getConnection(),
      data: this.controller.getData(),
    }
  }
}

export default RequestException
