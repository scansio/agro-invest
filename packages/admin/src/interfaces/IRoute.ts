import { RequestMethods } from './RequestMethods';
import { IPathMethodMetadata } from './IPathMethodMetadata';
import IValidation from './IValidation';
import { AuthenticationLevel } from './AuthenticationLevel';
import { IRouteField } from './IRouteFieldType';

export interface IRoute {
  path: string;
  controllerMemberFunctionIdentifier?: Function;
  method: RequestMethods;
  metadata: IPathMethodMetadata;
  validation?: IValidation;
  fields: IRouteField
  requireAuthentication?: AuthenticationLevel;
}
