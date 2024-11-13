import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { VanityProvider } from "./context/VanityContext";

// Disable right-click globally
document.addEventListener("contextmenu", (e) => e.preventDefault());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <VanityProvider>
      <App />
    </VanityProvider>
  </React.StrictMode>
);
