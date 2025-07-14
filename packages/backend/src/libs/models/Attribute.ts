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

export const getAttributes = <I extends {}, T extends Model<I, CreateType<I>>>(
  model: ModelStatic<T>,
  omit?: Partial<{ [K in keyof InferAttributes<T>]: boolean }>,
  overrides?: Partial<Attributes<T>>,
): Omit<Attributes<T>, keyof typeof excludes | keyof typeof omit> => {
  const tobeExcluded = { ...excludes, ...omit }
  const attrs = model.getAttributes()
  const result = {} as Attributes<T>
  for (const key in attrs) {
    let type: IRouteFieldOption['type'] = 'string'

    switch (attrs[key].type.constructor.name) {
      case DataTypes.NUMBER.name:
      case DataTypes.INTEGER.name:
      case DataTypes.DOUBLE.name:
      case DataTypes.FLOAT.name:
        type = 'number'
        break

      case DataTypes.JSON.name:
      case DataTypes.TEXT.name:
        type = 'textarea'
        break

      case DataTypes.BOOLEAN.name:
        type = 'checkbox'
        break

      case DataTypes.DATE.name:
        type = 'date'
        break

      case DataTypes.TIME.name:
        type = 'time'
        break

      case DataTypes.STRING.name:
      case DataTypes.CHAR.name:
      default:
        type = 'text'
        break
    }

    if (key === 'status') {
      type = 'switch'
    }

    if (!tobeExcluded[key as any]) {
      result[key as any as keyof InferAttributes<T>] = {
        type,
        default: attrs[key].defaultValue,
        description: attrs[key].comment,
        max: attrs[key].validate?.max as number,
        min: attrs[key].validate?.min as number,
        ...(attrs[key].allowNull !== undefined ? { required: !attrs[key].allowNull } : {}),
        ...(overrides || {})[key as any],
      }
    }
  }

  return result
}
