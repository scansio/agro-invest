import Reblend from "reblendjs";
import "./App.css";
import { Main } from "./components/layouts/Main";
import { AlertContainer } from "./components/basics/Alert";

function App() {
  return (
    <>
      <AlertContainer />
      <Main />
      <style>{`* {transition: all 350ms ease} `}</style>
    </>
  );
}

export default App;
