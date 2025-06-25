import { NextFunction, Request, Response } from 'express'
import BaseController from '../../libs/controller/BaseController'

class Misc extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async health() {
    return this.success('Healthy').send()
  }
}

export default Misc
