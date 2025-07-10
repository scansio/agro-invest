import { Handler, NextFunction, Request, Response, Router } from 'express'
import { ExpressValidator } from 'express-validator'
import { RequestMethods } from '../configs/constants'
import IPathValidators, { ValidatorOptions, DataFrom, ValidatorsFunctionName } from './types/IPathValidators'
import IValidation from './types/IValidation'

/**
 * Handles request validation for Express routes using express-validator.
 * Builds validation middleware stacks based on provided validation schemas.
 */
export default class RequestValidation {
  /**
   * Middleware to handle validation errors and format them for readability.
   * @param req - Express request object
   * @param _res - Express response object
   * @param next - Express next function
   */
  private validationErrorHandler = (req: Request, _res: Response, next: NextFunction) => {
    const result = this.dataValidator.validationResult(req)
    // Ensure unique errors and format them nicely
    const errors = Array.from(new Set(result.array().map((error) => `${(error as any).path}: ${error.msg}`)))
      .map((msg) => `- ${msg}`)
      .join('\n')

    if (errors) {
      next(new Error(`Validation failed:\n${errors}`))
    } else {
      next()
    }
  }
  private dataValidator = new ExpressValidator()
  private validationMiddlewares: Handler[]

  /**
   * Constructs a RequestValidation instance and builds validation middleware from the provided schema.
   * @param validation - Optional validation schema describing rules for body, param, query, etc.
   */
  constructor(validation?: IValidation) {
    this.validationErrorHandler = this.validationErrorHandler.bind(this)
    this.validationMiddlewares = []

    if (validation) {
      // For each data source (e.g., body, param, query), process its validation rules
      for (const [dataFrom, parameters] of Object.entries(validation)) {
        /**
         * Recursively traverses the validation object structure and builds validation middlewares.
         * @param validatorsOrParameters - The current level of validators or nested parameters.
         * @param fields - The path of fields being validated (used for nested fields).
         * @param dataFrom - The source of the data (body, param, query, etc.)
         */
        const val = (validatorsOrParameters: IPathValidators, fields: string[]) => {
          for (const [validatorOrParameterName, validatorOptionOrParameterValue] of Object.entries(
            validatorsOrParameters,
          )) {
            // Extract custom error message if provided
            const message = (validatorOptionOrParameterValue as ValidatorOptions).message
            // Get the validator function from the dataValidator instance
            const isValidator = this.dataValidator[dataFrom as DataFrom](fields.join('.'), message)[
              validatorOrParameterName as ValidatorsFunctionName
            ]
            // If a validator function exists, add it to the middleware stack
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (isValidator as any) {
              // Remove message from options to avoid passing it to the validator
              delete (validatorOptionOrParameterValue as ValidatorOptions)?.message
              this.validationMiddlewares.push(isValidator(validatorOptionOrParameterValue))
            } else {
              // If not a direct validator, recurse into nested validators/parameters
              val(validatorOptionOrParameterValue as IPathValidators, [...fields, validatorOrParameterName])
            }
          }
        }

        // For each top-level parameter (e.g., investmentType, unit), build validation middlewares
        for (const [parameter, valOrParams] of Object.entries(parameters as { [field: string]: IPathValidators })) {
          val(valOrParams, [parameter])
        }
      }
    }
  }

  /**
   * Wraps an Express route with the generated validation middlewares and error handler.
   * @param app - Express Router instance
   * @param middleware - The main route handler
   * @param method - HTTP method (GET, POST, etc.)
   * @param endpoint - Route endpoint path
   */
  wrap(app: Router, middleware: Handler, method: RequestMethods, endpoint: string) {
    app![method](endpoint, ...this.validationMiddlewares, this.validationErrorHandler, middleware)
  }
}
