/**
 * Rutas del administrador.
 * Cada modulo registra sus rutas en su propio archivo para que dos ramas no
 * editen el mismo listado al mismo tiempo.
 *
 * Todo /admin exige sesion de administrador o vendedor. Las secciones que el
 * vendedor no puede usar se vuelven a proteger con perfiles={["administrador"]}:
 * esconder la opcion del menu no basta, porque la URL se puede escribir a mano.
 */

import { Route } from "react-router-dom";
import RutaProtegida from "../components/RutaProtegida.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import Ordenes from "../pages/admin/Ordenes.jsx";
import OrdenDetalle from "../pages/admin/OrdenDetalle.jsx";
import Productos from "../pages/admin/Productos.jsx";
import ProductoForm from "../pages/admin/ProductoForm.jsx";
import ProductosCriticos from "../pages/admin/ProductosCriticos.jsx";
import Categorias from "../pages/admin/Categorias.jsx";
import CategoriaForm from "../pages/admin/CategoriaForm.jsx";
import Usuarios from "../pages/admin/Usuarios.jsx";
import UsuarioForm from "../pages/admin/UsuarioForm.jsx";
import UsuarioHistorial from "../pages/admin/UsuarioHistorial.jsx";
import Reportes from "../pages/admin/Reportes.jsx";
import Perfil from "../pages/admin/Perfil.jsx";

function soloAdministrador(pagina) {
  return <RutaProtegida perfiles={["administrador"]}>{pagina}</RutaProtegida>;
}

export const rutasAdmin = [
  <Route
    key="admin"
    path="/admin"
    element={<RutaProtegida perfiles={["administrador", "vendedor"]}><AdminLayout /></RutaProtegida>}
  >
    <Route index element={<Dashboard />} />
    <Route path="ordenes" element={<Ordenes />} />
    <Route path="ordenes/:numero" element={<OrdenDetalle />} />
    <Route path="productos" element={<Productos />} />
    <Route path="productos/nuevo" element={soloAdministrador(<ProductoForm />)} />
    <Route path="productos/:codigo/editar" element={soloAdministrador(<ProductoForm />)} />
    <Route path="productos-criticos" element={<ProductosCriticos />} />
    <Route path="categorias" element={soloAdministrador(<Categorias />)} />
    <Route path="categorias/nueva" element={soloAdministrador(<CategoriaForm />)} />
    <Route path="categorias/:id/editar" element={soloAdministrador(<CategoriaForm />)} />
    <Route path="usuarios" element={soloAdministrador(<Usuarios />)} />
    <Route path="usuarios/nuevo" element={soloAdministrador(<UsuarioForm />)} />
    <Route path="usuarios/:run/editar" element={soloAdministrador(<UsuarioForm />)} />
    <Route path="usuarios/:run/historial" element={soloAdministrador(<UsuarioHistorial />)} />
    <Route path="reportes" element={soloAdministrador(<Reportes />)} />
    <Route path="perfil" element={<Perfil />} />
  </Route>
];
