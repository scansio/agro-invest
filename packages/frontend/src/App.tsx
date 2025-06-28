import Reblend from "reblendjs";
import "./App.css";
import { Main } from "./components/layouts/Main";

function App() {
  return (
    <>
      <Main />
      <style>{`* {transition: all 350ms 100ms} `}</style>
    </>
  );
}

export default App;
