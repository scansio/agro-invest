import Reblend, { FC } from "reblendjs";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useIsMobile } from "../../lib/hooks";
import Router from "reblend-router";
import { routes } from "../../lib/routes";
import { Nav } from "../basics/Nav";

export const Main: FC = () => {
  const isMobileHook = useIsMobile();

  return (
    <>
      {isMobileHook.isMobile ? null : <Header />}
      <main
        style={{
          minHeight: isMobileHook.isMobile ? "90vh" : "95vh",
          marginBottom: isMobileHook.isMobile ? "5rem" : "0",
        }}
        class="w-full flex justify-center "
      >
        <div
          class={"bg-neutral-50 min-h-screen p-4 pt-6 "}
          style={{
            width: isMobileHook.isMobile ? "100%" : "50%",
          }}
        >
          <Router routes={routes} />
          <Nav
            items={[
              { label: "Theme Definition Sample", href: "/theme-definition" },
              { label: "Components Sammple ", href: "/" },
            ]}
          />
        </div>
      </main>
      <Footer isMobile={isMobileHook.isMobile} />
    </>
  );
};
