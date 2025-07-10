import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import DataStore from './DataStore'

const DataStoreRoutes: IControllerRoute = {
  tag: 'DataStore',
  controller: DataStore,
  baseUrl: '/data-store',
  routes: [
    {
      path: '/count/:store',
      controllerMemberFunctionIdentifier: DataStore.prototype.count,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get count of data store',
      },
      validation: {
        param: {
          store: {
            notEmpty: {},
          },
        },
      },
      requireAuthentication: AuthenticationLevel.END_USER,
    },
    {
      path: '/sum/:field/:store',
      controllerMemberFunctionIdentifier: DataStore.prototype.sum,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get sum of a field in data store',
      },
      validation: {
        param: {
          field: {
            notEmpty: {},
          },
          store: {
            notEmpty: {},
          },
        },
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: {},
  model: null,
  description: 'Operation on Data store model',
}

export default DataStoreRoutes
