/**
 * Botanik — Compra exitosa.
 *
 * Lee la orden desde db usando el numero de la URL, no desde la memoria del
 * checkout: asi el resumen sigue disponible si el cliente recarga la pagina.
 */

import { Link, useParams } from "react-router-dom";
import FormularioEnvio from "../../components/FormularioEnvio.jsx";
import TablaLineas from "../../components/TablaLineas.jsx";
import NoEncontrado from "./NoEncontrado.jsx";
import { db } from "../../services/db.js";
import { formatearPrecio, fechaLegible } from "../../services/formato.js";

/* La orden guarda nombre completo y direccion en un solo texto; para mostrarla
   en el mismo formulario del checkout se vuelve a separar. */
function datosDeOrden(orden) {
  const [nombre, ...apellidos] = orden.clienteNombre.split(" ");

  return {
    nombre,
    apellidos: apellidos.join(" "),
    correo: orden.clienteCorreo,
    calle: orden.direccion,
    departamento: "",
    region: orden.region,
    comuna: orden.comuna,
    indicaciones: orden.indicaciones || ""
  };
}

export default function CompraExitosa() {
  const { numero } = useParams();
  const orden = db.getOrden(numero);

  if (!orden) {
    return <NoEncontrado />;
  }

  return (
    <section className="bt-seccion">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="bt-tarjeta-form">
              <p className="text-end small mb-1">Codigo de orden: <strong>{orden.numero}</strong></p>
              <h1 className="h3 text-success">&#10004; Se ha realizado la compra. Nro {orden.numero}</h1>
              <p className="form-text mt-0">Fecha {fechaLegible(orden.fecha)}. Te enviaremos el detalle a {orden.clienteCorreo}.</p>

              <FormularioEnvio valores={datosDeOrden(orden)} soloLectura />

              <TablaLineas lineas={orden.lineas} />

              <div className="bt-resumen mt-3">
                {orden.descuento > 0 && (
                  <p className="text-center mb-1">Descuento {orden.cupon}: -{formatearPrecio(orden.descuento)}</p>
                )}
                <p className="h4 text-center mb-0">Total pagado: {formatearPrecio(orden.total)}</p>
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                <button className="btn btn-danger btn-sm" type="button" onClick={() => window.print()}>Imprimir boleta</button>
                <Link className="btn btn-primary btn-sm" to="/productos">Seguir comprando</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
