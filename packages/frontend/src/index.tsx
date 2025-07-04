import Reblend from "reblendjs";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

Reblend.mountOn("root", App, {
  //noDefering: true,
  noPreloader: true,
  deferTimeout: 0,
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CREBA-vitals
reportWebVitals(console.log);
