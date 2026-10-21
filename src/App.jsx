/**
 * Botanik — Raiz de la aplicacion.
 *
 * Los proveedores dejan la sesion y los avisos al alcance de cualquier
 * componente. Las rutas de la tienda comparten el Layout (cabecera y pie); las
 * del administrador traen su propio esqueleto con menu lateral.
 */

import { Routes, Route } from "react-router-dom";
import { SesionProvider } from "./context/SesionContext.jsx";
import { NotificacionProvider } from "./context/NotificacionContext.jsx";
import Layout from "./components/Layout.jsx";
import NoEncontrado from "./pages/tienda/NoEncontrado.jsx";
import { rutasTienda } from "./rutas/tienda.jsx";
import { rutasContenidos } from "./rutas/contenidos.jsx";
import { rutasCuenta } from "./rutas/cuenta.jsx";
import { rutasCompra } from "./rutas/compra.jsx";
import { rutasAdmin } from "./rutas/admin.jsx";

export default function App() {
  return (
    <SesionProvider>
      <NotificacionProvider>
        <Routes>
          <Route element={<Layout />}>
            {rutasTienda}
            {rutasContenidos}
            {rutasCuenta}
            {rutasCompra}
            <Route path="*" element={<NoEncontrado />} />
          </Route>
          {rutasAdmin}
        </Routes>
      </NotificacionProvider>
    </SesionProvider>
  );
}
