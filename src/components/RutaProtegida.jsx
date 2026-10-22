/**
 * Botanik — Control de acceso por perfil.
 *
 * Envuelve una ruta y decide si se muestra. Sin sesion manda al login y le
 * pasa la ruta de origen para volver despues de entrar. Con sesion pero sin
 * el perfil necesario, manda al panel (si puede entrar al admin) o a la tienda.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

export default function RutaProtegida({ perfiles, children }) {
  const { usuario, puedeEntrarAdmin } = useSesion();
  const location = useLocation();

  if (usuario === null) {
    return <Navigate to="/login" replace state={{ destino: location.pathname }} />;
  }

  if (!perfiles.includes(usuario.tipo)) {
    return <Navigate to={puedeEntrarAdmin ? "/admin" : "/"} replace />;
  }

  return children;
}
