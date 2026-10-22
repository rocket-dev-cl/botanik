/**
 * Botanik — No se pudo realizar el pago.
 *
 * Recibe del checkout, por el estado de la navegacion, los datos del intento.
 * El carrito no se vacio, asi que "Volver a realizar el pago" lleva de vuelta
 * al checkout con los mismos datos ya escritos.
 */

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import FormularioEnvio from "../../components/FormularioEnvio.jsx";
import TablaLineas from "../../components/TablaLineas.jsx";
import { formatearPrecio } from "../../services/formato.js";

export default function PagoFallido() {
  const { state: intento } = useLocation();
  const navegar = useNavigate();

  // Si se entra escribiendo la URL no hay intento que mostrar.
  if (!intento) {
    return <Navigate to="/carrito" replace />;
  }

  return (
    <section className="bt-seccion">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="bt-tarjeta-form">
              <h1 className="h3 text-danger">&#10006; No se pudo realizar el pago</h1>
              <p className="mb-3">{intento.motivo} No se realizo ningun cargo.</p>

              <div className="text-center">
                <button className="btn btn-success" type="button" onClick={() => navegar("/checkout", { state: { cliente: intento.cliente } })}>
                  Volver a realizar el pago
                </button>
              </div>

              <FormularioEnvio valores={intento.cliente} soloLectura />

              <TablaLineas lineas={intento.lineas} />

              <div className="bt-resumen mt-3">
                <p className="h4 text-center mb-0">Total a pagar: {formatearPrecio(intento.total)}</p>
              </div>

              <p className="text-center mt-3 mb-0"><Link to="/carrito">Volver al carrito</Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
