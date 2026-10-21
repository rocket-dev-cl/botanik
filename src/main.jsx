/**
 * Botanik — Punto de entrada.
 *
 * El orden de los estilos importa: primero Bootstrap y despues estilos.css, que
 * sobrescribe sus variables --bs-* con la identidad de Botanik. El bundle de
 * Bootstrap trae Popper, sin el cual el menu desplegable no abre.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/estilos.css";
import "./styles/admin.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
