import { useState } from "react";
import { InterfaceOverlay } from "./components/InterfaceOverlay";
import { VisualScene } from "./components/VisualScene";
import "./App.css";

function App() {
  const [engaged, setEngaged] = useState(false);

  return (
    <main className={`experience ${engaged ? "is-engaged" : ""}`}>
      <VisualScene engaged={engaged} />
      <InterfaceOverlay
        engaged={engaged}
        onToggle={() => setEngaged((current) => !current)}
      />
    </main>
  );
}

export default App;
