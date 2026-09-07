import { InterfaceOverlay } from "./components/InterfaceOverlay";
import { VisualScene } from "./components/VisualScene";
import styles from "./App.module.css";

function App() {
  return (
    <main className={styles.experience}>
      <VisualScene />
      <InterfaceOverlay />
    </main>
  );
}

export default App;
