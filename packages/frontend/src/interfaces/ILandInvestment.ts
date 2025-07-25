import ITimestamp from "./ITimestamp";
import IUser from "./IUser";

export interface ILandInvestment extends ITimestamp {
  uid: IUser["_id"];
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pricePerUnit: number;
  units: number;
  minUnits: number;
  remainingUnits: number;
  expenses: string[];
  featureNo: number;
  assets: string[];
}
