import Reblend from "reblendjs";
import "./index.css";
import "@fortawesome/fontawesome-free/css/solid.css"
import "@fortawesome/fontawesome-free/js/solid.js"
import App from "./App";
import reportWebVitals from "./reportWebVitals";

Reblend.mountOn("root", App, {
  noDefering: true,
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CREBA-vitals
reportWebVitals(console.log);
