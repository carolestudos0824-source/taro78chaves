import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

// Remove marker after React takes over
const marker = document.getElementById("boot-marker");
if (marker) {
  console.log("React mounting, removing boot marker");
  // Optional: keep it for a few ms to be sure user sees it
  // marker.remove(); 
}

try {
  root.render(<App />);
} catch (error) {
  console.error("Critical rendering error:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif; background: #FAF5EF; min-h: 100vh;">
      <h2 style="color: #5B1F3D;">Ops! Ocorreu um erro ao carregar o app.</h2>
      <p style="color: #5B1F3D;">Tente recarregar a página ou limpar o cache do navegador.</p>
      <button onclick="window.location.reload(true)" style="padding: 10px 20px; cursor: pointer; background: #C8A66A; color: #5B1F3D; border: none; font-weight: bold; border-radius: 8px;">Recarregar Agora</button>
      <pre style="text-align: left; background: #eee; padding: 10px; margin-top: 20px; font-size: 10px; overflow: auto;">${error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  `;
}
