import { APIVersionStatus } from '../../configs/constants'
import IAPIVersionInfo from './IAPIVersionInfo'
import { IControllerRoute } from './IControllerRoute'

export type IAPI = {
  info: IAPIVersionInfo
  controllerRoutes: IControllerRoute[]
  status: APIVersionStatus
}[]
