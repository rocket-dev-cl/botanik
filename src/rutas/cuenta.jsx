/**
 * Rutas de la cuenta (login y registro).
 * Cada modulo registra sus rutas en su propio archivo para que dos ramas no
 * editen el mismo listado al mismo tiempo.
 */

import { Route } from "react-router-dom";
import Login from "../pages/tienda/Login.jsx";
import Registro from "../pages/tienda/Registro.jsx";

export const rutasCuenta = [
  <Route key="login" path="login" element={<Login />} />,
  <Route key="registro" path="registro" element={<Registro />} />
];
