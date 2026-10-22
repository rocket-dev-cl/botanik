/**
 * Botanik — Resumen del carrito con el formulario de cupon.
 *
 * Recibe los montos por props y la funcion onAplicarCupon, que devuelve
 * { ok, mensaje }. El codigo escrito y el mensaje de error son estado propio
 * del componente: el error solo se muestra cuando existe.
 */

import { useState } from "react";
import { formatearPrecio } from "../services/formato.js";

export default function ResumenCompra({ cantidad, subtotal, descuento, total, cupon, onAplicarCupon, onQuitarCupon, children }) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  function aplicar(evento) {
    evento.preventDefault();
    const resultado = onAplicarCupon(codigo);

    if (resultado.ok) {
      setError("");
      setCodigo("");
    } else {
      setError(resultado.mensaje);
    }
  }

  return (
    <aside className="bt-resumen" aria-labelledby="tituloResumen">
      <h2 className="bt-titulo-seccion" id="tituloResumen">Resumen</h2>

      <div className="bt-resumen-fila mt-3">
        <span>{cantidad === 1 ? "1 item" : cantidad + " items"}</span>
        <span>{formatearPrecio(subtotal)}</span>
      </div>

      <form className="mt-3" onSubmit={aplicar} noValidate>
        <label className="form-label" htmlFor="cupon">Codigo de descuento</label>
        <div className="input-group has-validation">
          <input className={"form-control" + (error ? " is-invalid" : "")} type="text" id="cupon" placeholder="BOTANIK10"
            autoComplete="off" value={codigo} onChange={(evento) => setCodigo(evento.target.value)} />
          <button className="btn btn-outline-primary" type="submit">Aplicar</button>
          {error && <div className="invalid-feedback d-block" role="alert">{error}</div>}
        </div>
      </form>

      {cupon && (
        <div className="alert alert-success d-flex justify-content-between align-items-center mt-3 mb-0 py-2">
          <span className="small">{cupon.codigo}: {cupon.descripcion}</span>
          <button className="btn btn-sm btn-link p-0" type="button" onClick={onQuitarCupon}>Quitar</button>
        </div>
      )}

      {descuento > 0 && (
        <div className="bt-resumen-fila mt-3">
          <span>Descuento</span>
          <span>-{formatearPrecio(descuento)}</span>
        </div>
      )}

      <div className="bt-resumen-total mt-3">
        <span className="fw-medium">Total</span>
        <span className="bt-precio">{formatearPrecio(total)}</span>
      </div>

      {children}
    </aside>
  );
}
