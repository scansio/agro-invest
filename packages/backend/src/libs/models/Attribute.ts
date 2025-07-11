import { DataTypes, InferAttributes, Model, ModelStatic } from 'sequelize'
import { CreateType } from '../types/ITimestamp'
import { IRouteFieldOption } from '../types/IRouteFieldType'

export type Attributes<T extends Model> = {
  [K in keyof InferAttributes<T>]: IRouteFieldOption
}

const excludes = {
  createdAt: true,
  updatedAt: true,
}

export const getAttributes = <I extends {}, T extends Model<I, CreateType<I>>, E>(
  model: ModelStatic<T>,
  omit?: E,
  overrides?: { [K in keyof I]: IRouteFieldOption },
): Omit<Attributes<T>, keyof typeof excludes | keyof E> => {
  const tobeExcluded = { ...excludes, ...omit }
  const attrs = model.getAttributes()
  const result = {} as Attributes<T>
  for (const key in attrs) {
    let type: IRouteFieldOption['type'] = 'string'

    switch (attrs[key].type) {
      case DataTypes.NUMBER:
      case DataTypes.INTEGER:
      case DataTypes.DOUBLE:
      case DataTypes.FLOAT:
        type = 'number'
        break

      case DataTypes.JSON:
        type = 'number'
        break

      case DataTypes.BOOLEAN:
        type = 'checkbox'
        break

      case DataTypes.DATE:
        type = 'date'
        break

      default:
        type = 'string'
        break
    }

    if (key === 'status') {
      type = 'checkbox'
    }

    if (!tobeExcluded[key as any]) {
      result[key as any as keyof InferAttributes<T>] = {
        type,
        default: attrs[key].defaultValue,
        description: attrs[key].comment,
        max: attrs[key].validate?.max as number,
        min: attrs[key].validate?.min as number,
        ...overrides,
      }
    }
  }

  return result
}
