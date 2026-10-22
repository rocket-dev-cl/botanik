/**
 * Botanik — Tabla de productos de una compra.
 *
 * La usan el checkout, la compra exitosa y el pago fallido. Recibe las lineas
 * ya resueltas por props, asi que no sabe si vienen del carrito o de una orden
 * guardada: solo las muestra.
 */

import { formatearPrecio, rutaImagen } from "../services/formato.js";

export default function TablaLineas({ lineas }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {lineas.map((linea) => (
            <tr key={linea.codigo}>
              <td><img className="bt-linea-img" src={rutaImagen(linea.imagen)} alt="" /></td>
              <td>{linea.nombre}</td>
              <td className="text-end">{formatearPrecio(linea.precio)}</td>
              <td className="text-center">{linea.cantidad}</td>
              <td className="text-end">{formatearPrecio(linea.precio * linea.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
