/**
 * Botanik — Cabecera de la tienda.
 *
 * En la entrega 1 este marcado se repetia literal en las 11 vistas. En React es
 * un componente y se escribe una sola vez: Layout lo pone sobre cada pagina.
 * El menu desplegable y el boton hamburguesa siguen siendo de Bootstrap
 * (data-bs-toggle), cargado con bootstrap.bundle en main.jsx.
 */

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { db } from "../services/db.js";
import { formatearPrecio } from "../services/formato.js";

function claseEnlace({ isActive }) {
  return "nav-link" + (isActive ? " activo" : "");
}

export default function Navbar() {
  const { usuario, cerrarSesion, puedeEntrarAdmin } = useSesion();
  const { cantidadTotal, total } = useCarrito();
  const [busqueda, setBusqueda] = useState("");
  const navegar = useNavigate();
  const categorias = db.getCategorias();

  function buscar(evento) {
    evento.preventDefault();
    navegar("/productos?buscar=" + encodeURIComponent(busqueda.trim()));
  }

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <header className="bt-cabecera">
      <div className="container">
        <nav className="navbar navbar-expand-lg py-2" aria-label="Navegacion principal">
          <Link className="navbar-brand bt-logo" to="/">
            <img src="/img/ui/logo.svg" alt="Botanik" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir el menu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav bt-nav me-auto">
              <li className="nav-item"><NavLink className={claseEnlace} to="/" end>Home</NavLink></li>
              <li className="nav-item"><NavLink className={claseEnlace} to="/productos">Productos</NavLink></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categorias</a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/categorias">Todas las categorias</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  {categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <Link className="dropdown-item" to={"/categorias/" + categoria.id}>{categoria.nombre}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><NavLink className={claseEnlace} to="/ofertas">Ofertas</NavLink></li>
              <li className="nav-item"><NavLink className={claseEnlace} to="/nosotros">Nosotros</NavLink></li>
              <li className="nav-item"><NavLink className={claseEnlace} to="/blogs">Blogs</NavLink></li>
              <li className="nav-item"><NavLink className={claseEnlace} to="/contacto">Contacto</NavLink></li>
            </ul>

            <form className="d-flex my-2 my-lg-0 me-lg-3" role="search" onSubmit={buscar}>
              <label className="visually-hidden" htmlFor="busquedaGlobal">Buscar productos</label>
              <input className="form-control form-control-sm me-2" type="search" id="busquedaGlobal" placeholder="Buscar" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
              <button className="btn btn-outline-primary btn-sm" type="submit">Buscar</button>
            </form>

            <ul className="navbar-nav bt-acceso align-items-lg-center">
              {usuario === null && (
                <>
                  <li className="nav-item"><NavLink className={claseEnlace} to="/login">Iniciar sesion</NavLink></li>
                  <li className="nav-item"><NavLink className={claseEnlace} to="/registro">Crear cuenta</NavLink></li>
                </>
              )}
              {usuario !== null && (
                <>
                  <li className="nav-item"><span className="nav-link">Hola, {usuario.nombre}</span></li>
                  {puedeEntrarAdmin && (
                    <li className="nav-item"><Link className="nav-link" to="/admin">Administracion</Link></li>
                  )}
                  <li className="nav-item"><button className="nav-link" type="button" onClick={salir}>Cerrar sesion</button></li>
                </>
              )}
              <li className="nav-item ms-lg-3">
                <NavLink className="btn btn-primary btn-sm bt-carrito-enlace" to="/carrito" aria-label={"Carrito: " + cantidadTotal + " productos"}>
                  Carrito <span className="bt-carrito-conteo">{cantidadTotal}</span> {formatearPrecio(total)}
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
