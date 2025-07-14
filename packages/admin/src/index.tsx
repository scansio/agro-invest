import Reblend from "reblendjs";
import "./assets/index.css";
import "./assets/swagger-ui.css";
import "highlight.js/scss/intellij-light.scss";
import App from "./App";
import "./assets/css/scansio-style.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./assets/css/main.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";

declare global {
  interface Window {
    REBLEND_BASE_PATHNAME: string;
  }
}

let pathname =
  "/" + window.location.pathname.split("/").filter(Boolean).join("/");

window.REBLEND_BASE_PATHNAME = pathname == "/" ? "" : pathname;
Reblend.mountOn("root", App, {
  noPreloader: true,
  deferTimeout: 0,
  placeholderDeferTimeout: 0
});
