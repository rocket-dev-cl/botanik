/**
 * Botanik — Historial de ordenes (boletas).
 * Lista las ordenes de la mas reciente a la mas antigua, con filtro por estado
 * y busqueda por numero o cliente.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/db.js";
import { formatearPrecio, fechaLegible } from "../../services/formato.js";
import { coincide, nombreEstado } from "./utilidades.js";

export default function Ordenes() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  const ordenes = db.getOrdenes()
    .filter((orden) =>
      (estado === "" || orden.estado === estado) &&
      coincide(orden, ["numero", "clienteNombre", "clienteCorreo"], busqueda))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Ordenes</h1>
          <p className="text-body-secondary mb-0">Compras registradas en la tienda. Entra a una para ver su boleta.</p>
        </div>
      </div>

      <form className="row g-2 mb-3" onSubmit={(evento) => evento.preventDefault()}>
        <div className="col-12 col-md-6">
          <label className="visually-hidden" htmlFor="buscadorOrdenes">Buscar orden</label>
          <input className="form-control" type="search" id="buscadorOrdenes" placeholder="Buscar por numero o cliente" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <label className="visually-hidden" htmlFor="filtroEstado">Filtrar por estado</label>
          <select className="form-select" id="filtroEstado" value={estado} onChange={(evento) => setEstado(evento.target.value)}>
            <option value="">Todos los estados</option>
            {db.getEstadosOrden().map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="bt-tabla-envoltorio">
        <table className="table bt-tabla">
          <caption className="visually-hidden">Ordenes de compra</caption>
          <thead>
            <tr>
              <th scope="col">Numero</th>
              <th scope="col">Fecha</th>
              <th scope="col">Cliente</th>
              <th scope="col">Estado</th>
              <th scope="col" className="bt-num">Total</th>
              <th scope="col" className="text-end">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 && (
              <tr><td colSpan="6" className="text-center text-body-secondary">Ninguna orden coincide con la busqueda.</td></tr>
            )}
            {ordenes.map((orden) => (
              <tr key={orden.numero}>
                <td>{orden.numero}</td>
                <td>{fechaLegible(orden.fecha)}</td>
                <td>{orden.clienteNombre}</td>
                <td><span className={"bt-estado bt-estado-" + orden.estado}>{nombreEstado(orden.estado)}</span></td>
                <td className="bt-num">{formatearPrecio(orden.total)}</td>
                <td className="text-end">
                  <Link className="btn btn-outline-primary btn-sm" to={"/admin/ordenes/" + orden.numero}>Ver boleta</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-body-secondary small" role="status">{ordenes.length} ordenes</p>
    </>
  );
}
