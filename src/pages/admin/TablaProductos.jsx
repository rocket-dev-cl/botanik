/**
 * Botanik — Tabla de productos del administrador.
 *
 * La comparten el listado completo y el de productos criticos. Recibe los
 * productos ya filtrados por props; si llega onEliminar muestra las acciones.
 */

import { Link } from "react-router-dom";
import { formatearPrecio } from "../../services/formato.js";
import { nombreCategoria, enStockCritico } from "./utilidades.js";

function claseFila(producto) {
  if (Number(producto.stock) === 0) {
    return "bt-fila-critica bt-fila-agotada";
  }
  return enStockCritico(producto) ? "bt-fila-critica" : "";
}

export default function TablaProductos({ productos, puedeEditar, onEliminar }) {
  return (
    <div className="bt-tabla-envoltorio">
      <table className="table bt-tabla">
        <caption className="visually-hidden">Productos del catalogo</caption>
        <thead>
          <tr>
            <th scope="col">Codigo</th>
            <th scope="col">Producto</th>
            <th scope="col">Categoria</th>
            <th scope="col" className="bt-num">Precio</th>
            <th scope="col" className="bt-num">Stock</th>
            <th scope="col" className="bt-num">Critico</th>
            {puedeEditar && <th scope="col" className="text-end">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 && (
            <tr>
              <td colSpan={puedeEditar ? 7 : 6} className="text-center text-body-secondary">Ningun producto coincide con la busqueda.</td>
            </tr>
          )}
          {productos.map((producto) => (
            <tr key={producto.codigo} className={claseFila(producto)}>
              <td>{producto.codigo}</td>
              <td>
                {producto.nombre}
                {Number(producto.stock) === 0 && <span className="bt-marca-agotado ms-1">agotado</span>}
                {Number(producto.stock) > 0 && enStockCritico(producto) && <span className="bt-marca-critica ms-1">critico</span>}
              </td>
              <td>{nombreCategoria(producto.categoria)}</td>
              <td className="bt-num">
                {producto.precioOferta ? formatearPrecio(producto.precioOferta) + " (oferta)" : formatearPrecio(producto.precio)}
              </td>
              <td className="bt-num">{producto.stock}</td>
              <td className="bt-num">{producto.stockCritico ?? "-"}</td>
              {puedeEditar && (
                <td>
                  <div className="bt-acciones">
                    <Link className="btn btn-outline-primary btn-sm" to={"/admin/productos/" + producto.codigo + "/editar"}>Editar</Link>
                    {onEliminar && (
                      <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => onEliminar(producto)}>Eliminar</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
