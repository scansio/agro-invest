import Dashboard from "./pages/Dashboard";
import Git from "./pages/Git";
import Migration from "./pages/Migration";
import User from "./pages/User";

export const CustomComponents: { [key: string]: (props: any) => Reblend.JSX.Element } = {
  Dashboard,
  Git,
  Migration,
  User,
};
