import IConnectInfo from "./IConnectInfo";

//Response Structure Interface
export default interface IResStruct<D> {
  connection: IConnectInfo;
  data: D;
}
