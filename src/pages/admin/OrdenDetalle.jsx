/**
 * Botanik — Boleta de una orden.
 *
 * Muestra lo que quedo congelado al momento de la compra (nombre y precio de
 * cada linea) y permite cambiar el estado del despacho. El estado se guarda en
 * db apenas se elige.
 */

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../services/db.js";
import { formatearPrecio, fechaLegible } from "../../services/formato.js";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import { nombreEstado, nombreRegion, nombreComuna } from "./utilidades.js";

export default function OrdenDetalle() {
  const { numero } = useParams();
  const { notificar } = useNotificacion();
  const [orden, setOrden] = useState(() => db.getOrden(numero));

  if (!orden) {
    return (
      <div className="bt-vacio">
        <h1 className="h4">No encontramos esa orden</h1>
        <p>Es posible que el numero sea incorrecto.</p>
        <Link className="btn btn-primary" to="/admin/ordenes">Volver al historial</Link>
      </div>
    );
  }

  function cambiarEstado(evento) {
    const respuesta = db.actualizarOrden(orden.numero, { estado: evento.target.value });
    setOrden(respuesta.dato);
    notificar("Estado actualizado a " + nombreEstado(respuesta.dato.estado) + ".", "exito");
  }

  return (
    <>
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Administracion</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/ordenes">Ordenes</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{orden.numero}</li>
        </ol>
      </nav>

      <div className="bt-admin-encabezado">
        <div>
          <h1>Boleta {orden.numero}</h1>
          <p className="text-body-secondary mb-0">Registrada el {fechaLegible(orden.fecha)}</p>
        </div>
        <span className={"bt-estado bt-estado-" + orden.estado}>{nombreEstado(orden.estado)}</span>
      </div>

      <section className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="bt-ficha-orden">
            <h2>Cliente</h2>
            <dl>
              <dt>Nombre</dt><dd>{orden.clienteNombre}</dd>
              <dt>RUN</dt><dd>{orden.clienteRun || "Compra como invitado"}</dd>
              <dt>Correo</dt><dd>{orden.clienteCorreo}</dd>
            </dl>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="bt-ficha-orden">
            <h2>Despacho</h2>
            <dl>
              <dt>Direccion</dt><dd>{orden.direccion}</dd>
              <dt>Comuna</dt><dd>{nombreComuna(orden.region, orden.comuna)}</dd>
              <dt>Region</dt><dd>{nombreRegion(orden.region)}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="bt-titulo-seccion">Productos</h2>
        <div className="bt-tabla-envoltorio">
          <table className="table bt-tabla">
            <thead>
              <tr>
                <th scope="col">Codigo</th>
                <th scope="col">Producto</th>
                <th scope="col" className="bt-num">Precio</th>
                <th scope="col" className="bt-num">Cantidad</th>
                <th scope="col" className="bt-num">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.lineas.map((linea) => (
                <tr key={linea.codigo}>
                  <td>{linea.codigo}</td>
                  <td>{linea.nombre}</td>
                  <td className="bt-num">{formatearPrecio(linea.precio)}</td>
                  <td className="bt-num">{linea.cantidad}</td>
                  <td className="bt-num">{formatearPrecio(linea.precio * linea.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row mt-3 g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="estadoOrden">Estado del despacho</label>
            <select className="form-select" id="estadoOrden" value={orden.estado} onChange={cambiarEstado}>
              {db.getEstadosOrden().map((item) => (
                <option key={item.id} value={item.id}>{item.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <div className="bt-totales-orden">
              <div className="bt-resumen-fila"><span>Subtotal</span><span>{formatearPrecio(orden.subtotal)}</span></div>
              <div className="bt-resumen-fila"><span>Descuento{orden.cupon ? " (" + orden.cupon + ")" : ""}</span><span>-{formatearPrecio(orden.descuento)}</span></div>
              <div className="bt-resumen-fila bt-resumen-total"><span>Total</span><span>{formatearPrecio(orden.total)}</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
