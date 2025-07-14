export type IRouteFieldTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'time'
  | 'date'
  | 'file'
  | 'image'
  | 'email'
  | 'url'
  | 'password'
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'

export type IRouteFieldOption = {
  type: IRouteFieldTypes
  required?: boolean
  default?: any
  options?: { label: string; value: string }[]; // For select, radio, checkbox
  itemOptions?: IRouteFieldOption // For array of objects
  minLength?: number // For string
  maxLength?: number // For string
  min?: number // For number
  max?: number // For number
  pattern?: string // For string validation
  description?: string // For documentation purposes
  example?: any // For documentation purposes
  readOnly?: boolean // For fields that should not be modified
  multiple?: boolean // For file and radio type
  accept?: string // For file mime type
}

export type IRouteFieldOptions = {
  [key: string]: IRouteFieldOption
}

export type IRouteField = {
  header?: IRouteFieldOptions
  body?: IRouteFieldOptions
  param?: IRouteFieldOptions
  query?: IRouteFieldOptions
}
