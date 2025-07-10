import { AuthenticationLevel, RequestMethods } from '../../configs/constants'
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
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get team by id',
      },
    },
    {
      path: '/preview/:firstname-:lastname',
      controllerMemberFunctionIdentifier: Team.prototype.getTeamMemberByName,
      method: RequestMethods.GET,
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
