import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("main.tsx execution started - RESTORE REAL APP");

const marker = document.getElementById("boot-marker");
if (marker) {
  marker.innerText = "MAIN IMPORTED REAL APP";
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
  if (marker) marker.innerText = "ERROR: ROOT NOT FOUND";
} else {
  try {
    const root = createRoot(rootElement);
    console.log("Rendering App minimal...");
    root.render(<App />);
  } catch (err) {
    console.error("Critical error in main.tsx:", err);
    if (marker) marker.innerText = `CRITICAL ERROR: ${err}`;
  }
}
