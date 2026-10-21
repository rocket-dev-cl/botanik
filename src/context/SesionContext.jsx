/**
 * Botanik — Sesion compartida.
 *
 * La sesion vive en un contexto para que cualquier componente (la cabecera, el
 * checkout, el administrador) sepa quien entro sin recibirlo por props de
 * componente en componente. Se persiste en localStorage para sobrevivir a una
 * recarga del navegador.
 *
 * Solo se guarda la identidad del usuario. La direccion se lee del registro
 * del usuario en db, que es donde puede haber cambiado.
 */

import { createContext, useContext, useState } from "react";
import { Almacen, CLAVES } from "../services/db.js";

const SesionContext = createContext(null);

function sesionGuardada() {
  const sesion = Almacen.leer(CLAVES.sesion, null);
  return sesion && typeof sesion === "object" && sesion.correo ? sesion : null;
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(sesionGuardada);

  function iniciarSesion(datos) {
    const sesion = {
      run: datos.run,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      tipo: datos.tipo
    };

    Almacen.escribir(CLAVES.sesion, sesion);
    setUsuario(sesion);
  }

  function cerrarSesion() {
    Almacen.borrar(CLAVES.sesion);
    setUsuario(null);
  }

  const valor = {
    usuario,
    iniciarSesion,
    cerrarSesion,
    esAdministrador: usuario !== null && usuario.tipo === "administrador",
    puedeEntrarAdmin: usuario !== null && (usuario.tipo === "administrador" || usuario.tipo === "vendedor")
  };

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  return useContext(SesionContext);
}
