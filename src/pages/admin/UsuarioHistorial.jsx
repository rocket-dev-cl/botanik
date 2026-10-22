/**
 * Botanik — Historial de compras de un usuario.
 * Son las ordenes cuyo RUN de cliente coincide con el del usuario.
 */

import { Link, useParams } from "react-router-dom";
import { db } from "../../services/db.js";
import { formatearPrecio, fechaLegible } from "../../services/formato.js";
import { nombreEstado } from "./utilidades.js";

export default function UsuarioHistorial() {
  const { run } = useParams();
  const usuario = db.getUsuario(run);

  if (!usuario) {
    return (
      <div className="bt-vacio">
        <h1 className="h4">No encontramos ese usuario</h1>
        <Link className="btn btn-primary" to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  const ordenes = db.getOrdenesDeCliente(run);
  const totalComprado = ordenes
    .filter((orden) => orden.estado !== "cancelada")
    .reduce((suma, orden) => suma + orden.total, 0);

  return (
    <>
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Administracion</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Historial</li>
        </ol>
      </nav>

      <div className="bt-admin-encabezado">
        <div>
          <h1>Compras de {usuario.nombre} {usuario.apellidos}</h1>
          <p className="text-body-secondary mb-0">{ordenes.length} ordenes &middot; {formatearPrecio(totalComprado)} comprados</p>
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="bt-vacio">
          <p>Este usuario todavia no tiene compras.</p>
        </div>
      ) : (
        <div className="bt-tabla-envoltorio">
          <table className="table bt-tabla">
            <thead>
              <tr>
                <th scope="col">Numero</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col" className="bt-num">Total</th>
                <th scope="col" className="text-end">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.numero}>
                  <td>{orden.numero}</td>
                  <td>{fechaLegible(orden.fecha)}</td>
                  <td><span className={"bt-estado bt-estado-" + orden.estado}>{nombreEstado(orden.estado)}</span></td>
                  <td className="bt-num">{formatearPrecio(orden.total)}</td>
                  <td className="text-end"><Link className="btn btn-outline-primary btn-sm" to={"/admin/ordenes/" + orden.numero}>Ver boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
