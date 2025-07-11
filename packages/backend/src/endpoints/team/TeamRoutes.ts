import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
import { getAttributes } from '../../libs/models/Attribute'
import { IControllerRoute } from '../../libs/types/IControllerRoute'
import Team from './Team'
import TeamModel from './TeamModel'

const TeamRoutes: IControllerRoute = {
  tag: 'Team',
  controller: Team,
  baseUrl: '/team',
  routes: [
    {
      path: '/all',
      validation: { query: { q: {} } },
      fields: {
        query: {
          q: {
            type: 'string',
            description: 'Search query for teams',
            example: 'Development Team',
          },
        },
      },
      controllerMemberFunctionIdentifier: Team.prototype.all,
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get all teams',
      },
    },
    {
      path: '/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the team to retrieve',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get team by id',
      },
    },
    {
      path: '/preview/:firstname-:lastname',
      controllerMemberFunctionIdentifier: Team.prototype.getTeamMemberByName,
      method: RequestMethods.GET,
      fields: {
        param: {
          firstname: {
            type: 'string',
            description: 'First name of the team member',
            example: 'John',
          },
          lastname: {
            type: 'string',
            description: 'Last name of the team member',
            example: 'Doe',
          },
        },
      },
      metadata: {
        summary: 'Get team member by name',
      },
      validation: {
        param: {
          firstname: {},
          lastname: {},
        },
      },
    },
    {
      path: '',
      method: RequestMethods.POST,
      fields: {
        body: {
          uid: {
            type: 'string',
            description: 'Unique identifier for the team member',
            example: 'john-doe-123',
          },
          title: {
            type: 'string',
            description: 'Title of the team member',
            example: 'Software Engineer',
          },
        },
      },
      metadata: {
        summary: 'Create team',
      },
      validation: {
        body: {
          uid: { notEmpty: {} },
          title: { notEmpty: {} },
        },
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '',
      method: RequestMethods.PATCH,
      fields: {
        body: getAttributes(TeamModel),
      },
      metadata: {
        summary: 'Update team',
      },
      validation: {
        body: {
          _id: { notEmpty: {} },
          uid: { notEmpty: {} },
          title: { notEmpty: {} },
        },
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
    {
      path: '/:_id',
      validation: {
        param: {
          _id: {
            notEmpty: {},
          },
        },
      },
      fields: {
        param: {
          _id: {
            type: 'string',
            description: 'ID of the team to delete',
            example: '1234567890abcdef12345678',
          },
        },
      },
      method: RequestMethods.DELETE,
      metadata: {
        summary: 'Delete team',
      },
      requireAuthentication: AuthenticationLevel.ADMIN,
    },
  ],
  schema: TeamModel.getAttributes(),
  model: TeamModel,
  description: 'Operation on development team',
}

export default TeamRoutes
