/**
 * Botanik — Esqueleto del administrador.
 *
 * Menu lateral, contenido y pie. Las opciones del menu dependen del perfil: el
 * vendedor no ve las que no puede usar. Igual que en la entrega 1, la opcion
 * ajena al rol no se deshabilita, directamente no se dibuja.
 */

import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

const OPCIONES = [
  { ruta: "/admin", texto: "Dashboard", perfiles: ["administrador", "vendedor"], exacta: true },
  { ruta: "/admin/ordenes", texto: "Ordenes", perfiles: ["administrador", "vendedor"] },
  { ruta: "/admin/productos", texto: "Productos", perfiles: ["administrador", "vendedor"], exacta: true },
  { ruta: "/admin/productos-criticos", texto: "Productos criticos", perfiles: ["administrador", "vendedor"] },
  { ruta: "/admin/categorias", texto: "Categorias", perfiles: ["administrador"] },
  { ruta: "/admin/usuarios", texto: "Usuarios", perfiles: ["administrador"] },
  { ruta: "/admin/reportes", texto: "Reportes", perfiles: ["administrador"] },
  { ruta: "/admin/perfil", texto: "Perfil", perfiles: ["administrador", "vendedor"] }
];

const NOMBRES_PERFIL = {
  administrador: "Administrador",
  vendedor: "Vendedor"
};

export default function AdminLayout() {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  const opciones = OPCIONES.filter((opcion) => opcion.perfiles.includes(usuario.tipo));
  const iniciales = (usuario.nombre.charAt(0) + usuario.apellidos.charAt(0)).toUpperCase();

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <div className="bt-admin">
      <header className="bt-admin-lateral">
        <div className="bt-admin-marca">
          <img src="/img/ui/logo-blanco.svg" alt="Botanik" />
          <p>Administracion</p>
        </div>

        <nav aria-label="Menu del administrador">
          <ul className="bt-admin-menu">
            {opciones.map((opcion) => (
              <li key={opcion.ruta}>
                <NavLink to={opcion.ruta} end={opcion.exacta} className={({ isActive }) => (isActive ? "activo" : "")}>
                  {opcion.texto}
                </NavLink>
              </li>
            ))}
            <li><Link to="/">Ver la tienda</Link></li>
          </ul>
        </nav>

        <div className="bt-admin-usuario">
          <span className="bt-admin-avatar" aria-hidden="true">{iniciales}</span>
          <div>
            <strong>{usuario.nombre} {usuario.apellidos}</strong>
            <span>{NOMBRES_PERFIL[usuario.tipo]}</span>
            <button className="bt-admin-salir" type="button" onClick={salir}>Cerrar sesion</button>
          </div>
        </div>
      </header>

      <div className="bt-admin-columna">
        <main className="bt-admin-contenido" id="contenido">
          <Outlet />
        </main>
        <footer className="bt-admin-pie">
          Botanik &middot; Modulo de administracion &middot; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
