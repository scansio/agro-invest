import Reblend, { FC } from "reblendjs";
import { Nav } from "../basics/Nav";
import { routes } from "../../lib/routes";
import { Link } from "reblend-router";
import { IMAGE_BASE } from "../../lib/RestEndpoints";

export const Header: FC = () => {
  return (
    <header class="flex flex-row items-center justify-between px-6 py-3 mb-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-sm w-full z-30">
      {/* Brand Logo */}
      <div class="flex items-center gap-2">
        <img
          src="/logo192.png"
          alt="Brand Logo"
          class="h-10 w-10 rounded-full shadow"
        />
        <span class="text-xl font-bold text-brand-700 dark:text-brand-200 tracking-tight">
          AgroInvest
        </span>
      </div>
      {/* Navigation */}
      <Nav
        items={Object.values(routes)
          .map((route) =>
            route.showOnNav
              ? { label: route.tag, href: route.redirectUri, icon: route.icon }
              : (null as any)
          )
          .filter(Boolean)}
        className="mx-8"
      />
      {/* User Avatar */}
      <Link to={routes.profile.redirectUri} class="flex items-center gap-2">
        <img
          src={IMAGE_BASE + "/static/img/profile_picture.jpg"}
          alt="Avatar"
          class="inline-flex items-center justify-center bg-neutral-100 rounded-full h-10 w-10 object-cover"
        />
      </Link>
    </header>
  );
};
