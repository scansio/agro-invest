import Reblend from "reblendjs";
import "./App.css";
import { Main } from "./components/layouts/Main";

function App() {
  return (
    <>
      <Main />
      <style>{`* {transition: all 350ms ease} `}</style>
    </>
  );
}

export default App;
