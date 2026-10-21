/**
 * Botanik — Avisos breves (toasts).
 *
 * Reemplaza a UI.notificar de la entrega 1. Sigue sin usarse alert() ni
 * confirm(): cualquier componente llama notificar("texto", "exito") y el aviso
 * aparece en la esquina y se va solo.
 */

import { createContext, useContext, useState } from "react";

const NotificacionContext = createContext({ notificar: () => {} });

const CLASES = {
  exito: "bt-toast-exito",
  error: "bt-toast-error",
  aviso: "bt-toast-aviso"
};

const DURACION = 3500;

let siguienteId = 1;

export function NotificacionProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  function cerrar(id) {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
  }

  function notificar(mensaje, tipo = "exito") {
    const id = siguienteId++;
    setAvisos((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => cerrar(id), DURACION);
  }

  return (
    <NotificacionContext.Provider value={{ notificar }}>
      {children}
      <div className="bt-toasts" aria-live="polite" aria-atomic="true">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={"toast show align-items-center " + (CLASES[aviso.tipo] || CLASES.exito)} role="alert">
            <div className="d-flex">
              <div className="toast-body">{aviso.mensaje}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar" onClick={() => cerrar(aviso.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </NotificacionContext.Provider>
  );
}

export function useNotificacion() {
  return useContext(NotificacionContext);
}
