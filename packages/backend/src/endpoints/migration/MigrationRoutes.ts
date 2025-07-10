import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Migration from './Migration'

const MigrationRoutes: IControllerRoute = {
  tag: 'Migration',
  controller: Migration,
  baseUrl: '/migration',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },

      controllerMemberFunctionIdentifier: Migration.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all migrations',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/names',
      controllerMemberFunctionIdentifier: Migration.prototype.names,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get migration names',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/backup',
      controllerMemberFunctionIdentifier: Migration.prototype.backup,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get migration backup',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/:modelName',
      controllerMemberFunctionIdentifier: Migration.prototype.get,
      validation: {
        param: {
          modelName: {
            notEmpty: {},
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get a model data',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.POST,
      metadata: {
        summary: 'Create migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      metadata: {
        summary: 'Update migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '',
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
  ],
  schema: {},
  model: null,
  description: 'Operation on data migration',
}

export default MigrationRoutes
