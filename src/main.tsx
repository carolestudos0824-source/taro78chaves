import { createRoot } from "react-dom/client";
import App from "./App.tsx_minimal";
import "./index.css";

console.log("main.tsx execution started");

const marker = document.getElementById("boot-marker");
if (marker) {
  marker.innerText = "MAIN.TSX OK";
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
  if (marker) marker.innerText = "ERROR: ROOT NOT FOUND";
} else {
  try {
    const root = createRoot(rootElement);
    
    // Test A - minimal render
    root.render(
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998,
        background: '#1a0f1f',
        color: '#f5d78e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontFamily: 'serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>REACT ROOT MINIMAL OK</h1>
        <p style={{ fontSize: '16px', marginTop: '10px' }}>Se você está vendo esta tela escura com texto dourado, o React Root está funcionando.</p>
      </div>
    );
    
    if (marker) marker.innerText = "REACT RENDER CALLED";
  } catch (err) {
    console.error("Critical error in main.tsx:", err);
    if (marker) marker.innerText = `CRITICAL ERROR: ${err}`;
  }
}
