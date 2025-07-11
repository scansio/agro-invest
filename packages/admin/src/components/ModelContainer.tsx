import Reblend, { useContext } from "reblendjs";
import { modelsContext } from "../context";
import Model from "./Model";

function ModelContainer() {
  const [models] = useContext(modelsContext);

  return (
    <div style="height: auto; border: none; margin: 0px; padding: 0px;">
      <script
        src="https://unpkg.com/prettier@2.8.7/standalone.js"
        defer
      ></script>
      <script
        src="https://unpkg.com/prettier@2.8.7/parser-babel.js"
        defer
      ></script>

      {Array.from(models).map(([key, model]) => (
        <Model key={key} model={{ model, tag: key }} />
      ))}
    </div>
  );
}

export default ModelContainer;
