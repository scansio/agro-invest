import {
  BelongsToOptions,
  DataTypes,
  Model,
  ModelAttributeColumnOptions,
  ModelAttributeColumnReferencesOptions,
  ModelAttributes,
  ModelStatic,
} from 'sequelize'
import { ACTIVE } from '../../configs/constants'
import sequelize from '../../configs/database'
import { getApplicationDateFormat } from '../../common'

const TimestampsPlugin = <T extends Model<any, any>>(
  option: { [model: string]: ModelStatic<T> },
  modelAttributes: ModelAttributes<any, any>,
  associations?: {
    model: ModelStatic<Model<any, any>>
    option: BelongsToOptions
  }[],
): void => {
  const [modelName, model] = Object.entries(option).pop() || []

  if (!model) {
    return
  }

  const references: {
    referenceModel: ModelStatic<T>
    targetKey: string
    foreignKey: string
    as: string
  }[] = Object.entries(modelAttributes)
    .map(([columnName, columnOption]) => {
      const refColumnOption = columnOption as ModelAttributeColumnOptions<any>
      if (!refColumnOption.references) {
        return
      }
      const reference = refColumnOption.references as ModelAttributeColumnReferencesOptions

      if (!reference.model || !reference.key || typeof reference.model === 'string') {
        return
      }

      const referenceModel = reference.model as ModelStatic<T>

      return {
        targetKey: reference.key,
        foreignKey: columnName,
        as: columnName,
        ...{ referenceModel },
      }
    })
    .filter(Boolean) as any

  // Add the `status` field with a default value of ACTIVE
  model.init(
    {
      //@ts-ignore
      _id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4, // Use Sequelize's built-in UUID generator
        primaryKey: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: ACTIVE,
      },
      createdAt: {
        type: DataTypes.JSON,
        defaultValue: () => getApplicationDateFormat(),
      },
      updatedAt: {
        type: DataTypes.JSON,
      },
      ...modelAttributes,
    },
    {
      sequelize: sequelize,
      modelName: modelName?.split('Model')[0] || modelName,
      //timestamps: true, // Enable Sequelize's built-in timestamps
    },
  )

  // Add a hook to update `updatedAt` before updating a record
  model.beforeUpdate((instance) => {
    instance.setDataValue('updatedAt', getApplicationDateFormat())
  })

  if (associations?.length) {
    associations.forEach((association) => {
      // Define the association with the model
      model.belongsTo(association.model, association.option)
    })
  }

  // Define the association with the model
  references.forEach((reference) => {
    model.belongsTo(reference.referenceModel, {
      targetKey: reference.targetKey,
      foreignKey: reference.foreignKey,
      as: `${reference.as}Populated`,
    })
  })
}

export default TimestampsPlugin
