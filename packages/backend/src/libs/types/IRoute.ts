/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPathMethodMetadata } from './IPathMethodMetadata'
import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import IValidation from './IValidation'
import { IRouteField } from './IRouteFieldType'

export interface IRoute {
  path: string
  controllerMemberFunctionIdentifier?: (data?: any) => Promise<void>
  method: RequestMethods
  metadata: IPathMethodMetadata
  fields: IRouteField
  validation?: IValidation
  requireAuthentication?: AuthenticationLevel
}
