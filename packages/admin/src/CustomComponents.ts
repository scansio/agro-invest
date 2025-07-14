import Git from "./pages/Git";
import Migration from "./pages/Migration";
import User from "./pages/User";

export const CustomComponents: { [key: string]: (props: any) => Reblend.JSX.Element } = {
  Git,
  Migration,
  //User,
};
