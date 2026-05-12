import { createRoot } from "react-dom/client";
import App from "./App.tsx_minimal.tsx";
import "./index.css";

console.log("main.tsx execution started - Test B");

const marker = document.getElementById("boot-marker");
if (marker) {
  marker.innerText = "MAIN IMPORTED APP";
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
