/* eslint-disable @typescript-eslint/no-explicit-any */
import API from '../endpoints/API'
import { Router, NextFunction, Request, Response } from 'express'
import AllError from '../exceptions/base/AllError'
import { opendir } from 'fs/promises'
import path from 'path'
import Authenticate from './Authenticate'
import { BAD_AUTHENTICATION, BAD_AUTHORIZATION, SERVER_ERROR } from '../configs/statusCodeConstants'
import { BASE_PATH, getUser } from '../common'
import IUser from '../endpoints/user/IUser'
import RequestValidation from './RequestValidation'
import { APIVersionStatus, RequestMethodsMap } from '../configs/constants'
//import Logger from './Logger'

/**
 * Handles dynamic registration of all API routes, authentication, and file serving for the application.
 * Integrates validation, authentication, and controller invocation for each route.
 */
class Routing {
  /**
   * Public access level constant.
   */
  public PUBLIC: number = 0
  /**
   * Private access level constant.
   */
  public PRIVATE: number = 1
  /**
   * All access level constant.
   */
  public ALL: number = 2
  /**
   * Express Router instance used for route registration.
   */
  public app!: Router
  /**
   * Express Response object for the current request.
   */
  public res!: Response
  /**
   * Express Request object for the current request.
   */
  public req!: Request
  /**
   * Express NextFunction for the current request.
   */
  public next!: NextFunction

  /**
   * Initializes the Routing instance with the provided Express Router.
   * @param app - Express Router instance
   */
  constructor(app: Router) {
    this.app = app
  }

  /**
   * Wraps an async route handler to catch errors and pass them to next().
   * @param fn - The async route handler function
   * @returns Wrapped handler function
   */
  private asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next)
  }

  /**
   * Dynamically registers all API routes, including validation and authentication, from the API definition.
   */
  private __getRoutes() {
    for (const api of API) {
      if (api.status === APIVersionStatus.ENABLED) {
        for (const controllerRoute of api.controllerRoutes) {
          const controller = controllerRoute.controller
          for (const route of controllerRoute.routes) {
            const endpoint = `/${api.info.version}${controllerRoute.baseUrl}${route.path.startsWith('/') ? '' : '/'}${
              route.path
            }`

            const createRoute = async (req: Request, res: Response, next: NextFunction) => {
              this.req = req
              this.res = res
              this.next = next
              try {
                const isPrivateMethod = route.requireAuthentication
                isPrivateMethod && (await this.authRoute(req))

                const childSender = new controller(req, res, next)

                childSender.setExecutingClassName(controller.name)
                childSender.setIsPrivateRoute(this, isPrivateMethod)

                const clientDataTemp = {
                  ...this.req.params,
                  ...this.req.body,
                }

                const clientData: {
                  [k: string]: any
                } = {}

                for (const clientDataKey in clientDataTemp) {
                  const clientDataValue = clientDataTemp[clientDataKey]
                  if (typeof clientDataValue === 'string') {
                    //TODO Implement sanitization
                    clientData[clientDataKey] = clientDataValue
                  } else {
                    clientData[clientDataKey] = clientDataValue
                  }
                }

                ;(childSender as any).clientData = clientData
                childSender.directRequest = true
                const pre = await childSender?.init()
                await childSender?.initConstruct()
                if (!pre) {
                  const error = new AllError('You did not meet the criteria to access this resource')
                  error.statusCode = BAD_AUTHORIZATION
                  throw error
                }
                ;(
                  route.controllerMemberFunctionIdentifier ??
                  controller.prototype[RequestMethodsMap[route.method] as 'get']
                )
                  .call(childSender, clientData)
                  .catch((error: Error) => next(error))
              } catch (error) {
                next(error)
              }
            }

            new RequestValidation(route.validation).wrap(
              this.app,
              this.asyncHandler(createRoute),
              route.method,
              endpoint,
            )
          }
        }
      }
    }
  }

  /**
   * Authenticates a route and returns the user if authentication is successful.
   * @param req - Express Request object
   * @returns The authenticated user or null
   * @throws AllError if authentication fails
   */
  public async authRoute(req: Request): Promise<IUser | null> {
    const authenticate = new Authenticate(req)
    if (!(await authenticate.verify())) {
      const error = new AllError('Authentication Error')
      error.status = BAD_AUTHENTICATION
      throw error
    } else {
      return getUser(this.req)
    }
  }

  /**
   * Placeholder for implementing request sanitization logic.
   */
  sanitize() {
    //TODO Implement sanitization
  }

  /**
   * Registers public file serving routes for the application.
   */
  publicFileRoutes() {
    this.app?.use('/v*/puf/*', async (req: Request, res: Response, next) => {
      const p = `${req.originalUrl}`
      const trimmed = p.split('/puf')[1]
      const abp = path.resolve(`${BASE_PATH}/file_store/public${trimmed}`)
      try {
        await opendir(abp)
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      } catch (error) {
        res.sendFile(abp, (error) => {
          if (error) {
            const e = new AllError('Not Found')
            e.status = 404
            next(e)
          }
        })
      }
    })
  }

  /**
   * Registers private file serving routes for the application, requiring authentication.
   */
  privateFileRoutes() {
    this.app?.use('/v*/prf/*', async (req: Request, res: Response, next) => {
      this.req = req
      this.res = res
      this.next = next
      const user: IUser | null = await this.authRoute(req)
      if (!user) {
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      }
      const p = `${req.originalUrl}`
      const trimmed = p.split('/prf')[1]
      //let abp = path.resolve(BASE_PATH, `/file_store/private${trimmed}`);
      const abp_u = path.resolve(BASE_PATH, `/file_store/private/user/${user?._id}${trimmed}`)
      /* try {
        await opendir(abp);
      } catch (error) {
        if ((error as any).errno !== -2)
          res.sendFile(abp, (error) => {
            if (error) {
              let e = new AllError("Not Found");
              e.status = 404;
              next(e);
            }
          });
      } */
      try {
        await opendir(abp_u)
        const error = new AllError('Not Found')
        error.status = 404
        next(error)
      } catch (error) {
        res.sendFile(abp_u, (error) => {
          if (error) {
            const e = new AllError('Not Found')
            e.status = 404
            next(e)
          }
        })
      }
    })
  }

  /**
   * Registers all routes, including public, private, and API routes.
   */
  allRoutes() {
    this.publicFileRoutes()
    this.privateFileRoutes()
    this.__getRoutes()
  }
}

export default Routing
