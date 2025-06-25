import { Model } from 'sequelize'
import IDate from './IDate'

interface ITimestamp {
  _id: string | number
  createdAt: IDate
  updatedAt: IDate
  status: number
}

export type CreateType<Type, SubType extends keyof Type = any> = Omit<Omit<Type, keyof ITimestamp>, SubType>

//@ts-expect-error
export class GModel<T extends ITimestamp = any, TT extends {} = any> extends Model<T, TT> implements T {
  _id!: string | number
  createdAt!: IDate
  updatedAt!: IDate
  status!: number
}

export default ITimestamp
