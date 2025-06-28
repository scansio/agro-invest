import IDate from "./IDate";

interface ITimestamp<T = any> {
  _id: string | T;
  createdAt: IDate;
  updatedAt: IDate;
  status: number;
}

export default ITimestamp;
