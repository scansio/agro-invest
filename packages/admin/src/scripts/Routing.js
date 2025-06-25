import Reblend from 'reblendjs'
import { Route } from 'reblend-router'
import routes from './config/routes.js'
import ErrorWrapper from '../pages/ErrorWrapper.js'
import Authenticate from '../pages/pages_components/Authenticate'

class Routing {
  constructor() {
    this.__getRoutes = (type) => {
      switch (type) {
        case this.SECURE:
          type = 'secure'
          break

        case this.INSECURE:
        default:
          type = 'insecure'
          break
      }
      this.routers = routes[type]
      this.routeComponents = this.routers.map((prop) => {
        let Component = prop.component

        return !Component ? null : (
          <Route
            path={prop.path}
            Component={(cprops) =>
              type === 'insecure' ? (
                <ErrorWrapper>
                  <Component {...cprops} />
                </ErrorWrapper>
              ) : (
                <ErrorWrapper>
                  <Authenticate>
                    <Component {...cprops} />
                  </Authenticate>{' '}
                </ErrorWrapper>
              )
            }
            key={prop.path}
          />
        )
      })
      return this.routeComponents
    }
  }

  INSECURE = 0
  SECURE = 1

  getSecuredRoutes() {
    return this.__getRoutes(this.SECURE)
  }

  getInSecuredRoutes() {
    return this.__getRoutes(this.INSECURE)
  }
}

export default Routing
