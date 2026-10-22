/**
 * Botanik — Precio de un producto.
 *
 * Tres casos: gratis (precio 0), en oferta (precio normal tachado y precio de
 * oferta) o precio normal.
 */

import { formatearPrecio } from "../services/formato.js";

export default function Precio({ producto }) {
  if (producto.precio === 0) {
    return <span className="bt-precio-libre">Gratis</span>;
  }

  if (producto.precioOferta !== undefined) {
    return (
      <span>
        <del className="text-body-secondary small me-1">{formatearPrecio(producto.precio)}</del>
        <span className="bt-precio bt-precio-oferta">{formatearPrecio(producto.precioOferta)}</span>
      </span>
    );
  }

  return <span className="bt-precio">{formatearPrecio(producto.precio)}</span>;
}
