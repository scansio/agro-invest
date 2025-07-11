import { Link, useHash } from "reblend-router";
import { IControllerRoute } from "../interfaces/IControllerRoute";
import Reblend, { useEffect } from "reblendjs";
import { addModel } from "../context";

const SideBarItems = ({
  controllerRoutes,
}: {
  controllerRoutes: IControllerRoute[] | undefined;
}) => {
  const hash = useHash();

  useEffect(() => {
    controllerRoutes?.map((controllerRoute) => {
      addModel({
        model: JSON.stringify(controllerRoute?.schema),
        tag: controllerRoute?.tag,
      });
    });
  }, []);

  return (
    controllerRoutes
      ?.sort((a, b) => (a.tag || "").localeCompare(b.tag || ""))
      .map((controllerRoute) => {
        const tag = `${controllerRoute?.tag}`;
        const hashTag = `#${tag}-tag`;
        return (
          <Link
            key={`${tag}-tag`}
            id={`${tag}-tag`}
            href={`${window.REBLEND_BASE_PATHNAME}/${hashTag}`}
            className={`text-ellipsis ${
              hash === hashTag || hash?.split("#")[1] === tag
                ? "active-sidebutton"
                : ""
            }`}
          >
            {tag}
          </Link>
        );
      }) || null
  );
};

export default SideBarItems;
