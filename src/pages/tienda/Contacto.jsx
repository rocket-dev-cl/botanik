/**
 * Botanik — Formulario de contacto.
 *
 * Es un formulario controlado: lo que escribe el usuario se guarda en el
 * estado "valores" y el input muestra siempre ese estado. Al enviar se validan
 * los tres campos con las mismas reglas de la entrega 1 y cada error queda
 * junto a su campo.
 */

import { useState } from "react";
import CampoTexto from "../../components/CampoTexto.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";

const VACIO = { nombre: "", correo: "", comentario: "" };

const REGLAS = {
  nombre: Validaciones.nombreContacto,
  correo: Validaciones.correo,
  comentario: Validaciones.comentario
};

export default function Contacto() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const { notificar } = useNotificacion();

  function cambiar(campo, valor) {
    setValores({ ...valores, [campo]: valor });
    // Al corregir un campo se borra su error.
    setErrores({ ...errores, [campo]: "" });
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    setValores(VACIO);
    setEnviado(true);
    notificar("Recibimos tu mensaje.", "exito");
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <section className="text-center bt-marca-form">
            <img src="/img/ui/logo.svg" alt="Botanik" />
            <h1 className="mt-3">Escribenos</h1>
            <p className="bt-bajada mx-auto mt-2">Dudas sobre un pedido, cuidados de una planta o una reposicion dentro del primer mes.</p>
          </section>

          <section className="mt-4">
            {enviado && (
              <div className="alert alert-success" role="status">
                Recibimos tu mensaje. Te responderemos al correo indicado dentro de las proximas 48 horas habiles.
              </div>
            )}

            <form className="bt-tarjeta-form" onSubmit={enviar} noValidate>
              <h2 className="bt-titulo-seccion mb-4">Formulario de contacto</h2>

              <CampoTexto id="nombre" label="Nombre completo" obligatorio maxLength="100" autoComplete="name"
                value={valores.nombre} onChange={cambiar} error={errores.nombre} />

              <CampoTexto id="correo" label="Correo electronico" type="email" obligatorio maxLength="100" autoComplete="email"
                value={valores.correo} onChange={cambiar} error={errores.correo}
                ayuda="Solo aceptamos correos @duoc.cl, @profesor.duoc.cl o @gmail.com." />

              <CampoTexto id="comentario" label="Comentario" como="textarea" rows="5" obligatorio maxLength="500"
                value={valores.comentario} onChange={cambiar} error={errores.comentario}
                ayuda={valores.comentario.length + " de 500 caracteres"} />

              <button className="btn btn-primary btn-lg w-100" type="submit">Enviar mensaje</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
