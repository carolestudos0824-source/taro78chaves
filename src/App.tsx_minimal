import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const marker = document.getElementById("boot-marker");
    if (marker) {
      marker.innerText = "APP.TSX MINIMAL - RENDERING";
    }
    console.log("App Minimal mounted");
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999997,
      background: '#2d1b33',
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
      <h1>APP.TSX MINIMAL OK</h1>
      <p style={{ fontSize: '16px', marginTop: '10px' }}>O componente App básico está carregando corretamente.</p>
    </div>
  );
};

export default App;
