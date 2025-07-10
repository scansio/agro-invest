import Reblend from "reblendjs";
import "./assets/index.css";
import "./assets/swagger-ui.css";
import "highlight.js/scss/intellij-light.scss";
import App from "./App";
//import "./assets/css/scansio-style.css";
//import "./assets/css/util.css";
//import "./assets/css/main.css";
//import "@fortawesome/fontawesome-free/css/all.min.css";
//import "./assets/vendor/js/helpers.js";
//import "./assets/js/config.js";
//import "./assets/vendor/libs/popper/popper.js";
//import "./assets/vendor/js/menu.js";
//import "./assets/js/main.js";
//import "./assets/css/custom-style.scss";

import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";

let pathname =
  "/" + window.location.pathname.split("/").filter(Boolean).join("/");

(window as any).REBLEND_BASE_PATHNAME = pathname == "/" ? "" : pathname;
Reblend.mountOn("root", App);
