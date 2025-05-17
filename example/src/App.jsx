import { useState, useEffect } from "react";
import { snippetManager } from "shnippet";
import { config } from "../shnippet.config";

// Update the snippetManager with our config
snippetManager.updateConfig(config);

function App() {
  const [snippet, setSnippet] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSnippet() {
      try {
        // Try to load a test snippet
        const content = await snippetManager.getSnippet("example1", "python");
        setSnippet(content);
      } catch (err) {
        setError(err.message);
      }
    }
    loadSnippet();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shnippet Test</h1>
      {error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
          }}
        >
          {snippet || "Loading..."}
        </pre>
      )}
    </div>
  );
}

export default App;
