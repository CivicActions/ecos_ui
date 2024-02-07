import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./components/Layout.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <Home />
    </Layout>
  </React.StrictMode>
);
