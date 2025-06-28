import { useContext, useEffect, useReducer } from "reblendjs";
import { redirectTo } from "reblend-router";
import { userContext, loginRedirectUrl } from "./contexts";
import { routes } from "./routes";

//@ReblendHook
export function useAllowAthenticated() {
  const [auth] = useContext(userContext);

  useEffect(() => {
    if (!auth) {
      loginRedirectUrl.update(window.location.pathname);
      redirectTo(routes.login.redirectUri);
    }
  });

  return [];
}

const MOBILE_BREAKPOINT = 768;

//@ReblendHook
export function useIsMobile() {
  const useIsMobileReturn = { isMobile: false };

  const [, setIsMobile] = useReducer<boolean, boolean>((_, curr) => {
    useIsMobileReturn.isMobile = curr;
    return curr;
  }, false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return useIsMobileReturn;
}

//@ReblendHook
export function useScroll() {
  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  return;
}
