import { Model, ModelStatic } from 'sequelize'
import BaseController from '../controller/BaseController'
import { IRoute } from './IRoute'

export interface IControllerRoute {
  schema: object
  model: ModelStatic<Model<any, any>> | null
  routes: IRoute[]
  tag: string
  baseUrl: string
  description: string
  externalDocs?: {
    description: string
    url: string
  }
  controller: typeof BaseController
}
