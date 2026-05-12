import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

try {
  root.render(<App />);
} catch (error) {
  console.error("Critical rendering error:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h2>Ops! Ocorreu um erro ao carregar o app.</h2>
      <p>Tente recarregar a página ou limpar o cache do navegador.</p>
      <button onclick="window.location.reload(true)" style="padding: 10px 20px; cursor: pointer;">Recarregar Agora</button>
    </div>
  `;
}
