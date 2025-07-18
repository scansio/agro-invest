import Reblend from "reblendjs";
import {
  faHome,
  faPiggyBank,
  faChartLine,
  faPalette,
  faCubes,
  faUserCircle,
  faUserAlt,
  faWallet,
  faChevronCircleRight,
  faConciergeBell,
  faInfo,
  faExchangeAlt,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type RouteProp = {
  tag: string;
  redirectUri: string;
  path: string;
  showOnNav?: boolean;
  showOnMore?: boolean;
  showOnDocker?: boolean;
  showOnlyOnAuthenticated?: boolean;
  Component?: () => any;
  icon: Reblend.JSX.Element | null;
};

export type Routes = {
  index: RouteProp;
  home: RouteProp;
  transactions: RouteProp;
  deposit: RouteProp;
  withdraw: RouteProp;
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
  profile: RouteProp;

  onboarding: RouteProp;
  invest: RouteProp;
  investments: RouteProp;
  investment: RouteProp;
  wallet: RouteProp;
  more: RouteProp;
  about: RouteProp;
  policy: RouteProp;
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

  onboarding: {
    tag: "Onboarding",
    path: "/onboarding",
    redirectUri: "/onboarding",
    icon: <FontAwesomeIcon icon={faUserCircle} />,
    showOnNav: true,
    Component: () => import("../pages/Onboarding").then((m) => m.Onboarding),
  },

  profile: {
    tag: "Profile",
    path: "/profile",
    redirectUri: "/profile",
    icon: <FontAwesomeIcon icon={faUserAlt} />,
    showOnMore: true,
    showOnNav: true,
    Component: () => import("../pages/Profile").then((m) => m.Profile),
  },

  invest: {
    tag: "My Invest",
    path: "/my-invest",
    redirectUri: "/my-invest",
    icon: <FontAwesomeIcon icon={faPiggyBank} />, // Piggy bank icon
    showOnDocker: true,
    showOnMore: true,
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

  wallet: {
    tag: "Wallet",
    path: "/wallet",
    redirectUri: "/wallet",
    icon: <FontAwesomeIcon icon={faWallet} />,
    showOnDocker: true,
    showOnMore: true,
    showOnNav: true,
    Component: () => import("../pages/Wallet").then((m) => m.Wallet),
  },

  investment: {
    tag: "Investment",
    path: "/investment",
    redirectUri: "/investment",
    icon: <FontAwesomeIcon icon={faChartLine} />, // Chart line icon
    showOnNav: true,
    Component: () => import("../pages/Investment").then((m) => m.Investment),
  },

  transactions: {
    tag: "Transactions",
    path: "/transactions",
    redirectUri: "/transactions",
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    showOnMore: true,
    showOnNav: true,
    Component: () =>
      import("../pages/Transactions").then((m) => m.Transactions),
  },

  more: {
    tag: "More",
    path: "/more",
    redirectUri: "/more",
    icon: <FontAwesomeIcon icon={faChevronCircleRight} />,
    showOnDocker: true,
    showOnNav: true,
    Component: () => import("../pages/More").then((m) => m.More),
  },

  about: {
    tag: "About",
    path: "/about",
    redirectUri: "/about",
    icon: <FontAwesomeIcon icon={faInfo} />,
    showOnMore: true,
    showOnNav: true,
    Component: () => import("../pages/About").then((m) => m.About),
  },

  team: {
    tag: "Team",
    path: "/team",
    redirectUri: "/team",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () => import("../pages/Team").then((m) => m.Team),
  },

  signup: {
    tag: "Sign up",
    path: "/sign-up",
    redirectUri: "/sign-up",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () =>
      import("../pages/authentication/Signup").then((m) => m.Signup),
  },

  login: {
    tag: "Log in",
    path: "/login",
    redirectUri: "/login",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () => import("../pages/authentication/Login").then((m) => m.Login),
  },

  verifymail: {
    tag: "Verify Mail",
    path: "/verify-mail",
    redirectUri: "/verify-mail",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () =>
      import("../pages/authentication/verify-email").then((m) => m.VerifyEmail),
  },

  resetpassword: {
    tag: "Reset Password",
    path: "/reset-password",
    redirectUri: "/reset-password",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () =>
      import("../pages/authentication/reset-password").then(
        (m) => m.ResetPassword
      ),
  },

  emailresetpassword: {
    tag: "Email Reset Password",
    path: "/email-reset-password",
    redirectUri: "/email-reset-password",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () =>
      import("../pages/authentication/email-reset-password").then(
        (m) => m.EmailResetPassword
      ),
  },

  teamPreview: {
    tag: "Team Preview",
    path: "/team-preview",
    redirectUri: "/team-preview",
    icon: <FontAwesomeIcon icon={faUserCog} />,
    showOnNav: true,
    Component: () => import("../pages/TeamPreview").then((m) => m.TeamPreview),
  },

  policy: {
    tag: "Policy",
    path: "/policy",
    redirectUri: "/policy",
    icon: <FontAwesomeIcon icon={faConciergeBell} />,
    showOnMore: true,
    showOnNav: true,
    Component: () => import("../pages/Policy").then((m) => m.Policy),
  },

  themeDefinition: {
    tag: "Theme Definition",
    path: "/theme-definition",
    redirectUri: "/theme-definition",
    icon: <FontAwesomeIcon icon={faPalette} />, // Palette icon
    Component: () =>
      import("../ThemeDefinitionSample").then((m) => m.ThemeDefinitionSample),
  },

  componentsSample: {
    tag: "Components Sample",
    path: "/",
    redirectUri: "/",
    icon: <FontAwesomeIcon icon={faCubes} />, // Cubes icon
    Component: () =>
      import("../ComponentsSample").then((m) => m.ComponentsSample),
  },
};
