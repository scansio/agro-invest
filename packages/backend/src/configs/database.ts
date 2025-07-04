import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import { isProductionEnvironment } from '../common'

dotenv.config()

const dbConnectionString = isProductionEnvironment()
  ? process.env.DATABASE_URI_PASS
  : process.env.DATABASE_URI_PASS_LOCAL

if (!dbConnectionString) {
  throw new Error('Database connection string is not defined in environment variables.')
}

const sequelize = new Sequelize(dbConnectionString, {
  dialect: 'mysql',
  logging: false, // Set to true to enable SQL query logging
})

export default sequelize
