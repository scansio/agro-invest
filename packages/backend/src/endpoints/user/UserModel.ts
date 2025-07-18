import { DataTypes, Model } from 'sequelize'
import md5 from '../../libs/md5'
import { AuthenticationLevel, INACTIVE, UserType } from '../../configs/constants'
import IUser from './IUser'
import { CreateType } from '../../libs/types/ITimestamp'
import TimestampsPlugin from '../../libs/models/TimestampsPlugin'
import { randomInt } from 'crypto'

interface UserModel extends IUser {}

class UserModel extends Model<IUser, CreateType<IUser>> {}

TimestampsPlugin({ UserModel } as any, {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: () => {
      return randomInt(1111111111, 9999999999)
    }
  },
  refID: {
    type: DataTypes.STRING,
    references: {
      model: 'Users',
      key: '_id',
    },
    onDelete: 'SET NULL', // Handle deletion of the referenced row
    onUpdate: 'CASCADE', // Handle updates to the referenced row
  },
  firstname: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('password', value ? md5(value) : null)
    },
    get() {
      return '****'
    },
  },
  pin: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('pin', value ? md5(value) : null)
    },
    get() {
      return this.getDataValue('pin') ? '****' : ''
    },
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: INACTIVE,
  },
  oauth: {
    type: DataTypes.BOOLEAN,
  },
  verifiedUser: {
    type: DataTypes.BOOLEAN,
  },
  verifiedDriver: {
    type: DataTypes.BOOLEAN,
  },
  expoToken: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: AuthenticationLevel.END_USER,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: UserType.REGULAR,
  },
  dob: {
    type: DataTypes.DATE,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [7, 10],
    },
  },
  avatar: {
    type: DataTypes.STRING,
  },
})

export default UserModel
