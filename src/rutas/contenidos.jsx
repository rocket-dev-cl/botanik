/**
 * Rutas de los contenidos (nosotros, blogs y contacto).
 * Cada modulo registra sus rutas en su propio archivo para que dos ramas no
 * editen el mismo listado al mismo tiempo.
 *
 * Son hijas del Layout, por eso van sin barra inicial.
 */

import { Route } from "react-router-dom";
import Nosotros from "../pages/tienda/Nosotros.jsx";
import Blogs from "../pages/tienda/Blogs.jsx";
import BlogDetalle from "../pages/tienda/BlogDetalle.jsx";
import Contacto from "../pages/tienda/Contacto.jsx";

export const rutasContenidos = [
  <Route key="nosotros" path="nosotros" element={<Nosotros />} />,
  <Route key="blogs" path="blogs" element={<Blogs />} />,
  <Route key="blog" path="blogs/:id" element={<BlogDetalle />} />,
  <Route key="contacto" path="contacto" element={<Contacto />} />
];
