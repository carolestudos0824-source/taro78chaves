import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register the PWA service worker with custom push support
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline.');
  },
});

// Register our custom push service worker separately if not already handled
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('Custom Push SW registered:', registration);
      })
      .catch(error => {
        console.error('Custom Push SW registration failed:', error);
      });
  });
}

// Global error handler for dynamic import failures (chunk errors)
const handleChunkError = (error: any) => {
  const errorMessage = error?.message || error?.reason?.message || "";
  const isChunkError = 
    errorMessage.includes('Failed to fetch dynamically imported module') || 
    errorMessage.includes('Importing a module script failed') ||
    errorMessage.includes('Loading chunk failed') ||
    errorMessage.includes('ChunkLoadError');

  if (isChunkError) {
    console.error("Chunk load error detected:", errorMessage);
    
    // Use sessionStorage to prevent infinite reload loops
    const lastReload = sessionStorage.getItem('last-chunk-reload');
    const now = Date.now();
    
    // If we reloaded less than 10 seconds ago, it's a persistent error
    if (lastReload && (now - parseInt(lastReload)) < 10000) {
      console.error("Persistent chunk error after reload. Showing user message.");
      const message = document.createElement('div');
      message.style.cssText = 'fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF5EF] p-6 text-center';
      message.innerHTML = `
        <div style="max-width: 400px; font-family: sans-serif;">
          <h2 style="color: #5B1F3D; font-size: 20px; margin-bottom: 12px;">Atualizamos a plataforma</h2>
          <p style="color: #5B1F3DCC; font-size: 14px; margin-bottom: 20px;">Recarregue a página manualmente para continuar sua jornada.</p>
          <button onclick="window.location.reload()" style="background: #5B1F3D; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Recarregar agora</button>
        </div>
      `;
      document.body.appendChild(message);
      return;
    }

    sessionStorage.setItem('last-chunk-reload', now.toString());
    window.location.reload();
  }
};

window.addEventListener('error', (e) => handleChunkError(e));
window.addEventListener('unhandledrejection', (e) => handleChunkError(e));

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
