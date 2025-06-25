import IUser from "../../endpoints/user/IUser"

export default interface BaseInitFunction {
  init(): Promise<boolean | null | IUser | undefined>
  initConstruct(): Promise<void>
}
