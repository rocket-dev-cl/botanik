/**
 * Rutas de la tienda (home, catalogo, categorias, ofertas, detalle y carrito).
 * Cada modulo registra sus rutas en su propio archivo para que dos ramas no
 * editen el mismo listado al mismo tiempo.
 *
 * Son hijas del Layout, por eso van sin barra inicial.
 */

import { Route } from "react-router-dom";
import Home from "../pages/tienda/Home.jsx";
import Productos from "../pages/tienda/Productos.jsx";
import DetalleProducto from "../pages/tienda/DetalleProducto.jsx";
import Categorias from "../pages/tienda/Categorias.jsx";
import Ofertas from "../pages/tienda/Ofertas.jsx";
import Carrito from "../pages/tienda/Carrito.jsx";

export const rutasTienda = [
  <Route key="home" index element={<Home />} />,
  <Route key="productos" path="productos" element={<Productos />} />,
  <Route key="producto" path="producto/:codigo" element={<DetalleProducto />} />,
  <Route key="categorias" path="categorias" element={<Categorias />} />,
  <Route key="categoria" path="categorias/:id" element={<Categorias />} />,
  <Route key="ofertas" path="ofertas" element={<Ofertas />} />,
  <Route key="carrito" path="carrito" element={<Carrito />} />
];
