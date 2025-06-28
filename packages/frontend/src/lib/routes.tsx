import Reblend from 'reblendjs';
import { faHome, faPiggyBank, faChartLine, faPalette, faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type RouteProp = {
  tag: string;
  redirectUri: string;
  path: string;
  showOnNav?: boolean;
  showOnDocker?: boolean;
  showOnlyOnAuthenticated?: boolean;
  Component?: (() => any);
  icon: Reblend.JSX.Element | null;
};

export type Routes = {
  index: RouteProp;
  home: RouteProp;
  transaction: RouteProp;
  deposit: RouteProp;
  withdraw: RouteProp;
  bankdetail: RouteProp;
  team: RouteProp;
  teamPreview: RouteProp;
  teamPreview1: RouteProp;
  About: RouteProp;
  location: RouteProp;
  How_it_works: RouteProp;
  Contact_us: RouteProp;
  login: RouteProp;
  signup: RouteProp;
  resetpassword: RouteProp;
  testimonial: RouteProp;
  faq: RouteProp;
  emailresetpassword: RouteProp;
  advertform: RouteProp;
  verifymail: RouteProp;
  profileSettings: RouteProp;

  invest: RouteProp;
  investments: RouteProp;
  themeDefinition: RouteProp;
  componentsSample: RouteProp;
};

export const routes: Routes = {
  home: {
    tag: "Home",
    path: "/home",
    redirectUri: "/home",
    icon: <FontAwesomeIcon icon={faHome} />, // Home icon
    showOnDocker: true,
    showOnNav: true,
    Component: () => import("../pages/Home").then((m) => m.Home),
  },

  invest: {
    tag: "My Invest",
    path: "/my-invest",
    redirectUri: "/my-invest",
    icon: <FontAwesomeIcon icon={faPiggyBank} />, // Piggy bank icon
    showOnDocker: true,
    showOnNav: true,
    Component: () => import("../pages/MyInvest").then((m) => m.MyInvest),
  },

  investments: {
    tag: "Investments",
    path: "/investments",
    redirectUri: "/investments",
    icon: <FontAwesomeIcon icon={faChartLine} />, // Chart line icon
    showOnDocker: true,
    showOnNav: true,
    Component: () => import("../pages/Investments").then((m) => m.Investments),
  },

  themeDefinition: {
    tag: "Theme Definition",
    path: "/theme-definition",
    redirectUri: "/theme-definition",
    icon: <FontAwesomeIcon icon={faPalette} />, // Palette icon
    Component: () => import("../ThemeDefinitionSample").then((m) => m.ThemeDefinitionSample),
  },

  componentsSample: {
    tag: "Components Sample",
    path: "/",
    redirectUri: "/",
    icon: <FontAwesomeIcon icon={faCubes} />, // Cubes icon
    Component: () => import("../ComponentsSample").then((m) => m.ComponentsSample),
  },
};
