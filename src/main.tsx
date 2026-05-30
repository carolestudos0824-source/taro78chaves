import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler for dynamic import failures (chunk errors)
window.addEventListener('error', (e) => {
  if (e.message?.includes('Failed to fetch dynamically imported module') || 
      e.message?.includes('Importing a module script failed')) {
    console.warn("Chunk load error detected, reloading page...");
    window.location.reload();
  }
});

// For promise-based dynamic imports
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('Failed to fetch dynamically imported module') ||
      e.reason?.message?.includes('Importing a module script failed')) {
    console.warn("Chunk load promise rejection detected, reloading page...");
    window.location.reload();
  }
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (err) {
    console.error("Critical error in main.tsx:", err);
  }
}
