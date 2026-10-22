/**
 * Rutas de la compra (checkout y resultado del pago).
 * Cada modulo registra sus rutas en su propio archivo para que dos ramas no
 * editen el mismo listado al mismo tiempo.
 */

import { Route } from "react-router-dom";
import Checkout from "../pages/tienda/Checkout.jsx";
import CompraExitosa from "../pages/tienda/CompraExitosa.jsx";
import PagoFallido from "../pages/tienda/PagoFallido.jsx";

export const rutasCompra = [
  <Route key="checkout" path="checkout" element={<Checkout />} />,
  <Route key="exitosa" path="compra/exitosa/:numero" element={<CompraExitosa />} />,
  <Route key="fallida" path="compra/fallida" element={<PagoFallido />} />
];
