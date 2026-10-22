/**
 * Botanik — Registro de usuario.
 *
 * Mismo patron que el login: un objeto de estado con todos los campos, un mapa
 * de reglas y un objeto de errores. Las reglas que dependen de los datos (RUN
 * o correo repetido) se arman aca, sobre las reglas base de validaciones.js.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoTexto from "../../components/CampoTexto.jsx";
import SelectRegionComuna from "../../components/SelectRegionComuna.jsx";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { db } from "../../services/db.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";

const VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  fechaNacimiento: "",
  correo: "",
  contrasena: "",
  confirmacion: "",
  region: "",
  comuna: "",
  direccion: "",
  telefono: ""
};

const REGLAS = {
  run(valor) {
    const base = Validaciones.run(valor);
    if (base.valido && db.getUsuario(valor.trim().toUpperCase())) {
      return { valido: false, mensaje: "Ya existe una cuenta con ese RUN." };
    }
    return base;
  },
  nombre: Validaciones.nombre,
  apellidos: Validaciones.apellidos,
  fechaNacimiento: Validaciones.fechaNacimiento,
  correo(valor) {
    const base = Validaciones.correo(valor);
    if (base.valido && db.buscarUsuarioPorCorreo(valor)) {
      return { valido: false, mensaje: "Ya existe una cuenta con ese correo." };
    }
    return base;
  },
  contrasena: Validaciones.contrasena,
  confirmacion: (valor, valores) => Validaciones.confirmacion(valor, valores.contrasena),
  region: (valor) => Validaciones.seleccion(valor, "una region"),
  comuna: (valor) => Validaciones.seleccion(valor, "una comuna"),
  direccion: Validaciones.direccion,
  telefono: Validaciones.telefono
};

export default function Registro() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const { iniciarSesion } = useSesion();
  const { notificar } = useNotificacion();
  const navegar = useNavigate();

  /* Se usa la forma con funcion porque SelectRegionComuna llama dos veces
     seguidas (region y luego comuna vacia) y ambas deben quedar aplicadas. */
  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const usuario = {
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim().toLowerCase(),
      telefono: valores.telefono.trim(),
      fechaNacimiento: valores.fechaNacimiento || null,
      tipo: "cliente",
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim()
    };

    const respuesta = db.crearUsuario(usuario);

    if (!respuesta.ok) {
      notificar(respuesta.mensaje, "error");
      return;
    }

    iniciarSesion(usuario);
    notificar("Cuenta creada. Bienvenido a Botanik, " + usuario.nombre + ".", "exito");
    navegar("/");
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <section className="text-center bt-marca-form">
            <img src="/img/ui/logo.svg" alt="Botanik" />
            <h1 className="h3 mt-3">Crear una cuenta</h1>
            <p className="form-text">Los campos marcados con <span className="bt-obligatorio">*</span> son obligatorios.</p>
          </section>

          <section className="mt-4">
            <form className="bt-tarjeta-form" onSubmit={enviar} noValidate>
              <fieldset className="border-0 p-0 m-0 mb-3">
                <legend className="bt-titulo-seccion mb-3">Identificacion</legend>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <CampoTexto id="run" label="RUN" obligatorio maxLength="9" placeholder="211234563" autoComplete="off" ayuda="Sin puntos ni guion, con digito verificador." value={valores.run} onChange={cambiar} error={errores.run} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CampoTexto id="fechaNacimiento" label="Fecha de nacimiento" type="date" ayuda="Opcional." value={valores.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CampoTexto id="nombre" label="Nombre" obligatorio maxLength="50" autoComplete="given-name" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CampoTexto id="apellidos" label="Apellidos" obligatorio maxLength="100" autoComplete="family-name" value={valores.apellidos} onChange={cambiar} error={errores.apellidos} />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-0 p-0 m-0 mb-3">
                <legend className="bt-titulo-seccion mb-3">Acceso</legend>
                <CampoTexto id="correo" label="Correo electronico" type="email" obligatorio maxLength="100" autoComplete="email" ayuda="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com." value={valores.correo} onChange={cambiar} error={errores.correo} />
                <div className="row">
                  <div className="col-12 col-md-6">
                    <CampoTexto id="contrasena" label="Contrasena" type="password" obligatorio maxLength="10" autoComplete="new-password" ayuda="Entre 4 y 10 caracteres." value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CampoTexto id="confirmacion" label="Repetir contrasena" type="password" obligatorio maxLength="10" autoComplete="new-password" value={valores.confirmacion} onChange={cambiar} error={errores.confirmacion} />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-0 p-0 m-0 mb-3">
                <legend className="bt-titulo-seccion mb-3">Despacho</legend>
                <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} errores={errores} />
                <CampoTexto id="direccion" label="Direccion" obligatorio maxLength="300" autoComplete="street-address" value={valores.direccion} onChange={cambiar} error={errores.direccion} />
                <CampoTexto id="telefono" label="Telefono" type="tel" maxLength="15" placeholder="+56 9 1234 5678" ayuda="Opcional. Lo usamos solo para coordinar la entrega." value={valores.telefono} onChange={cambiar} error={errores.telefono} />
              </fieldset>

              <button className="btn btn-primary btn-lg w-100" type="submit">Crear cuenta</button>

              <p className="text-center mt-3 mb-0">
                Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
