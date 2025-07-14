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
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Query string to filter migrations',
            example: 'name=UserMigration',
          },
        },
      },
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
      fields: {},
      metadata: {
        summary: 'Get migration names',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '/backup',
      controllerMemberFunctionIdentifier: Migration.prototype.backup,
      method: RequestMethods.GET,
      fields: {},
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
      fields: {
        param: {
          modelName: {
            type: 'string',
            description: 'Name of the model to get migration data for',
            example: 'User',
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
      fields: {},
      metadata: {
        summary: 'Create migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {},
      metadata: {
        summary: 'Update migration',
      },
      requireAuthentication: AuthenticationLevel.DEVELOPER,
    },
    {
      path: '',
      method: RequestMethods.DELETE,
      fields: {
        body: {
          all: { type: 'boolean', description: 'Delete all migrations', default: false },
          models: {
            type: 'array',
            itemOptions: { type: 'string', description: 'Model names to delete migrations for' },
            example: ['User', 'Product'],
            description: 'List of model names to delete migrations for',
          },
        },
      },
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
