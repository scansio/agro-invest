import { Link } from "reblend-router";
import Reblend, { FC } from "reblendjs";
import { routes } from "../lib/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useAllowAthenticated } from "../lib/hooks";
import { authTokenContext, userContext } from "../lib/contexts";

export const More: FC = () => {
  useAllowAthenticated();

  const links = Object.entries(routes)
    .filter(([, item]) => item.showOnMore)
    .map(([key, item]) => (
      <Link
        key={key}
        href={item.redirectUri}
        class="flex flex-row items-center gap-4 rounded-2xl border border-neutral-200 px-4 py-5 bg-white text-neutral-900 text-lg font-semibold hover:bg-neutral-50 transition group"
      >
        <span class="text-brand-500 text-2xl w-8 flex items-center justify-center">
          {item.icon}
        </span>
        <span class="flex-1">{item.tag}</span>
        <span class="text-neutral-400 group-hover:text-brand-700 text-xl">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </Link>
    ));

  function logout() {
    authTokenContext.update("");
    userContext.update(null);
  }

  return (
    <div class="flex flex-col">
      <div class="text-2xl font-bold text-neutral-900 mb-8">More</div>
      <div class="flex flex-col gap-6 mb-8">{links}</div>
      <a
        href="#logout"
        class="flex flex-row items-center gap-4 rounded-2xl border border-danger-200 px-4 py-5 bg-white text-danger-600 text-lg font-semibold hover:bg-danger-50 transition mt-4"
        onclick={logout}
      >
        <span class="text-2xl w-8 flex items-center justify-center">
          <FontAwesomeIcon icon={faSignOut} />
        </span>
        <span class="flex-1">Log Out</span>
      </a>
    </div>
  );
};
