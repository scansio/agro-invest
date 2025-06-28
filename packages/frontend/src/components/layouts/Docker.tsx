import Reblend, { FC, useMemo } from "reblendjs";
import { routes } from "../../lib/routes";
import { Link, useLocation } from "reblend-router";

export const Docker: FC = () => {
  const location = useLocation();

  const dockerItems = useMemo(() => {
    const isActive = (path: string) => {
      return location?.path === path;
    };

    return Object.values(routes)
      .filter((route) => route.showOnDocker)
      .map((route) => (
        <Link
          to={route.redirectUri}
          className={
            "flex flex-col items-center justify-center px-2 py-1 mx-1 rounded-lg transition hover:bg-brand-50 dark:hover:bg-brand-900 group min-w-[64px] " +
            (isActive(route.redirectUri)
              ? "bg-brand-100 dark:bg-brand-800"
              : "bg-transparent")
          }
          aria-label={route.tag}
          key={route.path}
        >
          <div class="flex items-center justify-center w-5 h-5 text-brand-600 dark:text-brand-300 group-hover:text-brand-800 dark:group-hover:text-brand-100 transition">
            {route.icon}
          </div>
          <div class="text-xs font-medium text-neutral-700 dark:text-neutral-200 group-hover:text-brand-700 dark:group-hover:text-brand-100 truncate w-full text-center">
            {route.tag}
          </div>
        </Link>
      ));
  }, location?.path);

  return (
    <nav class="fixed bottom-0 left-0 right-0 flex flex-row justify-center items-end w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 shadow-lg py-1 px-2 z-50">
      {dockerItems}
    </nav>
  );
};
