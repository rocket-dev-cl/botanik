/**
 * Botanik — Pie de la tienda, con el formulario del boletin (R.12).
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Validaciones } from "../services/validaciones.js";
import { useNotificacion } from "../context/NotificacionContext.jsx";

export default function Footer() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const { notificar } = useNotificacion();

  function suscribir(evento) {
    evento.preventDefault();
    const resultado = Validaciones.correo(correo);

    if (!resultado.valido) {
      setError(resultado.mensaje);
      return;
    }

    setError("");
    setCorreo("");
    notificar("Listo. Te escribiremos con consejos de cuidado.", "exito");
  }

  return (
    <footer className="bt-pie">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <img src="/img/ui/logo-blanco.svg" alt="Botanik" />
            <p className="mt-3 mb-0 small">Vivero en linea especializado en plantas, maceteros, sustratos y herramientas de jardineria. Despacho a todo Chile.</p>
          </div>
          <div className="col-6 col-lg-2">
            <h2>Catalogo</h2>
            <ul className="bt-pie-lista mt-3">
              <li><Link to="/categorias/plantas">Plantas</Link></li>
              <li><Link to="/categorias/maceteros">Maceteros</Link></li>
              <li><Link to="/categorias/herramientas">Herramientas</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h2>Botanik</h2>
            <ul className="bt-pie-lista mt-3">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-12 col-lg-4">
            <h2>Recibe consejos de cuidado</h2>
            <form className="mt-3" onSubmit={suscribir} noValidate>
              <label className="form-label visually-hidden" htmlFor="correoBoletin">Correo electronico</label>
              <div className="input-group has-validation">
                <input className={"form-control" + (error ? " is-invalid" : "")} type="email" id="correoBoletin" placeholder="tu@correo.cl" autoComplete="email" maxLength="100" value={correo} onChange={(evento) => setCorreo(evento.target.value)} />
                <button className="btn btn-light" type="submit">Suscribir</button>
                {error && <div className="invalid-feedback d-block">{error}</div>}
              </div>
            </form>
            <div className="bt-pagos mt-3">
              <img src="/img/ui/pago-visa.svg" alt="Visa" />
              <img src="/img/ui/pago-mastercard.svg" alt="Mastercard" />
              <img src="/img/ui/pago-webpay.svg" alt="WebPay" />
              <img src="/img/ui/pago-transferencia.svg" alt="Transferencia bancaria" />
            </div>
          </div>
        </div>
        <p className="bt-pie-legal mt-4 pt-3 mb-0">&copy; {new Date().getFullYear()} Botanik &middot; Proyecto academico DSY1104</p>
      </div>
    </footer>
  );
}
