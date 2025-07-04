import Reblend, { FC } from "reblendjs";
import { Nav } from "../basics/Nav";
import { routes } from "../../lib/routes";

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
      <div class="flex items-center gap-2">
        <img
          src="https://ui-avatars.com/api/?name=User&background=brand&color=fff"
          alt="User"
          class="h-9 w-9 rounded-full border-2 border-brand-300 dark:border-brand-600 shadow"
        />
      </div>
    </header>
  );
};
