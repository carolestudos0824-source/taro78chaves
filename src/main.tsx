import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("main.tsx execution started");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  throw new Error("Failed to find the root element");
}

// Boot markers removed for final render
const marker = document.getElementById("boot-marker");

try {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  
  console.log("Rendering App component...");
  root.render(<App />);
  console.log("root.render called");
} catch (error) {
  console.error("Critical rendering error during root setup:", error);
  const errorMsg = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : "No stack trace";
  
  if (marker) {
    marker.style.background = "red";
    marker.innerText = `CRITICAL ERROR: ${errorMsg}`;
  }
  
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif; background: #FAF5EF; min-height: 100vh; color: #5B1F3D;">
      <h2>Ops! Ocorreu um erro crítico ao iniciar o app.</h2>
      <p>Erro: ${errorMsg}</p>
      <pre style="text-align: left; background: #f4f4f4; padding: 15px; margin-top: 20px; font-size: 11px; overflow: auto; border: 1px solid #ccc;">${errorStack}</pre>
      <button onclick="window.location.reload(true)" style="padding: 12px 24px; cursor: pointer; background: #C8A66A; color: #5B1F3D; border: none; font-weight: bold; border-radius: 8px; margin-top: 20px;">Tentar Recarregar</button>
    </div>
  `;
}
