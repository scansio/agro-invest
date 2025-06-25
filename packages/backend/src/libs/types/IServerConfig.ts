import { Express } from 'express'
export default interface IServerConfig {
  name: string
  module: () => Promise<Express>
}
