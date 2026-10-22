/**
 * Botanik — Inicio de sesion.
 *
 * Formulario controlado: cada campo vive en el estado del componente y React
 * vuelve a pintar el input con ese valor. Los errores tambien son estado y solo
 * se muestran cuando existen.
 *
 * Sin servidor no hay verificacion real de credenciales (ERS 3.3.2): se
 * comprueba que la cuenta exista y que la contrasena cumpla el largo.
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CampoTexto from "../../components/CampoTexto.jsx";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { db } from "../../services/db.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";

const REGLAS = {
  correo: Validaciones.correo,
  contrasena: Validaciones.contrasena
};

function destinoSegunPerfil(tipo) {
  return tipo === "administrador" || tipo === "vendedor" ? "/admin" : "/";
}

export default function Login() {
  const [valores, setValores] = useState({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState({});
  const { iniciarSesion } = useSesion();
  const { notificar } = useNotificacion();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  function cambiar(campo, valor) {
    setValores({ ...valores, [campo]: valor });
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);

    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      return;
    }

    const usuario = db.buscarUsuarioPorCorreo(valores.correo);

    if (!usuario) {
      setErrores({ correo: "No existe una cuenta registrada con ese correo." });
      return;
    }

    setErrores({});
    iniciarSesion(usuario);
    notificar("Bienvenido de vuelta, " + usuario.nombre + ".", "exito");

    // Si llego desde una pagina protegida o desde el checkout, vuelve ahi.
    const pedido = ubicacion.state && ubicacion.state.destino;
    navegar(pedido || destinoSegunPerfil(usuario.tipo));
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="text-center bt-marca-form">
            <img src="/img/ui/logo.svg" alt="Botanik" />
            <h1 className="h3 mt-3">Iniciar sesion</h1>
          </section>

          <section className="mt-4">
            <form className="bt-tarjeta-form" onSubmit={enviar} noValidate>
              <CampoTexto id="correo" label="Correo electronico" type="email" obligatorio maxLength="100" autoComplete="email" value={valores.correo} onChange={cambiar} error={errores.correo} />
              <CampoTexto id="contrasena" label="Contrasena" type="password" obligatorio maxLength="10" autoComplete="current-password" ayuda="Entre 4 y 10 caracteres." value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />

              <button className="btn btn-primary btn-lg w-100" type="submit">Entrar</button>

              <p className="text-center mt-3 mb-0">
                No tienes cuenta? <Link to="/registro">Registrate</Link>
              </p>
            </form>
          </section>

          <section className="mt-4">
            <div className="alert alert-warning mb-0">
              <h2 className="h6">Cuentas de prueba</h2>
              <p className="small mb-2">No hay servidor, por lo que no se verifican contrasenas: basta que el correo exista y que la contrasena cumpla el largo.</p>
              <ul className="small mb-0 ps-3">
                <li>Administrador: <code>camila.rojas@profesor.duoc.cl</code></li>
                <li>Vendedor: <code>v.cortes@duoc.cl</code></li>
                <li>Cliente: <code>josefa.navarro@gmail.com</code></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
