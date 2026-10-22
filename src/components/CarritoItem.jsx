/**
 * Botanik — Una linea del carrito.
 *
 * Muestra el producto, su cantidad y su subtotal. Los botones -, + y Eliminar
 * no cambian nada por si mismos: llaman a las funciones que recibe por props
 * (onCambiarCantidad, onEliminar), y la pagina Carrito decide que hacer.
 */

import { Link } from "react-router-dom";
import { formatearPrecio, rutaImagen } from "../services/formato.js";
import { precioVigente } from "../services/carrito.js";

export default function CarritoItem({ linea, onCambiarCantidad, onEliminar }) {
  const { producto, cantidad, subtotal } = linea;

  return (
    <article className="bt-linea">
      <img className="bt-linea-img" src={rutaImagen(producto.imagen)} alt={producto.nombre} />
      <div>
        <h3 className="h6 mb-1"><Link to={"/producto/" + producto.codigo}>{producto.nombre}</Link></h3>
        <p className="text-body-secondary small mb-1">{producto.codigo}</p>
        <p className="text-body-secondary small mb-0">{formatearPrecio(precioVigente(producto))} c/u</p>
      </div>
      <div className="input-group input-group-sm bt-cantidad">
        <button className="btn btn-outline-secondary" type="button" aria-label="Quitar una unidad"
          onClick={() => onCambiarCantidad(producto.codigo, cantidad - 1)}>&minus;</button>
        <input className="form-control" type="text" value={cantidad} readOnly aria-label={"Cantidad de " + producto.nombre} />
        <button className="btn btn-outline-secondary" type="button" aria-label="Agregar una unidad"
          onClick={() => onCambiarCantidad(producto.codigo, cantidad + 1)}>+</button>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="bt-linea-subtotal">{formatearPrecio(subtotal)}</span>
        <button className="btn btn-sm btn-outline-danger" type="button" aria-label={"Eliminar " + producto.nombre + " del carrito"}
          onClick={() => onEliminar(producto.codigo)}>Eliminar</button>
      </div>
    </article>
  );
}
