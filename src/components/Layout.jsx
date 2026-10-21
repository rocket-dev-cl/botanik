/**
 * Botanik — Esqueleto de las vistas de la tienda.
 *
 * Cabecera, contenido y pie. <Outlet /> es el hueco donde React Router pone la
 * pagina que corresponde a la URL.
 */

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  /* Al cambiar de pagina el navegador no vuelve arriba solo, porque en una SPA
     no hay recarga. Se hace a mano. */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="bt-salto-contenido" href="#contenido">Saltar al contenido</a>
      <Navbar />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
