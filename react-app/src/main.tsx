import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import '@cmsgov/ds-healthcare-gov/css/index.css';
import '@cmsgov/ds-healthcare-gov/css/healthcare-theme.css';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
