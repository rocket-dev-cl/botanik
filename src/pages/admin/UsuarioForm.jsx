/**
 * Botanik — Crear y editar un usuario.
 *
 * Mismo criterio que el formulario de producto: con RUN en la URL edita y el
 * RUN queda fijo; sin RUN crea. db rechaza un RUN o un correo repetido y el
 * motivo se muestra en un aviso.
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/db.js";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import CampoTexto from "../../components/CampoTexto.jsx";
import SelectRegionComuna from "../../components/SelectRegionComuna.jsx";
import { PERFILES } from "./utilidades.js";

const VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  tipo: "cliente",
  region: "",
  comuna: "",
  direccion: ""
};

const REGLAS = {
  run: Validaciones.run,
  nombre: Validaciones.nombre,
  apellidos: Validaciones.apellidos,
  correo: Validaciones.correo,
  fechaNacimiento: Validaciones.fechaNacimiento,
  tipo: (valor) => Validaciones.seleccion(valor, "un perfil"),
  region: (valor) => Validaciones.seleccion(valor, "una region"),
  comuna: (valor) => Validaciones.seleccion(valor, "una comuna"),
  direccion: Validaciones.direccion
};

export default function UsuarioForm() {
  const { run } = useParams();
  const navegar = useNavigate();
  const { notificar } = useNotificacion();
  const existente = run ? db.getUsuario(run) : null;
  const editando = Boolean(run);

  const [valores, setValores] = useState(existente ? { ...VACIO, ...existente, fechaNacimiento: existente.fechaNacimiento || "" } : VACIO);
  const [errores, setErrores] = useState({});

  if (editando && !existente) {
    return (
      <div className="bt-vacio">
        <h1 className="h4">No encontramos ese usuario</h1>
        <Link className="btn btn-primary" to="/admin/usuarios">Volver al listado</Link>
      </div>
    );
  }

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  function guardar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const usuario = {
      ...valores,
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim().toLowerCase(),
      fechaNacimiento: valores.fechaNacimiento || null,
      direccion: valores.direccion.trim()
    };

    const respuesta = editando
      ? db.actualizarUsuario(run, usuario)
      : db.crearUsuario(usuario);

    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");

    if (respuesta.ok) {
      navegar("/admin/usuarios");
    }
  }

  return (
    <>
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Administracion</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{editando ? "Editar" : "Nuevo"}</li>
        </ol>
      </nav>

      <div className="bt-admin-encabezado">
        <h1>{editando ? "Editar " + existente.nombre + " " + existente.apellidos : "Nuevo usuario"}</h1>
      </div>

      <form className="bt-admin-form" onSubmit={guardar} noValidate>
        <fieldset>
          <legend>Identificacion</legend>
          <div className="row">
            <div className="col-12 col-md-4">
              <CampoTexto id="run" label="RUN" value={valores.run} onChange={cambiar} error={errores.run} obligatorio readOnly={editando} maxLength="9" placeholder="19011022K" ayuda="Sin puntos ni guion" />
            </div>
            <div className="col-12 col-md-4">
              <CampoTexto id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} obligatorio maxLength="50" />
            </div>
            <div className="col-12 col-md-4">
              <CampoTexto id="apellidos" label="Apellidos" value={valores.apellidos} onChange={cambiar} error={errores.apellidos} obligatorio maxLength="100" />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <CampoTexto id="correo" label="Correo" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} obligatorio maxLength="100" />
            </div>
            <div className="col-6 col-md-3">
              <CampoTexto id="fechaNacimiento" label="Fecha de nacimiento" type="date" value={valores.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} />
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="form-label" htmlFor="tipo">Perfil<span className="bt-obligatorio" aria-hidden="true"> *</span></label>
              <select className="form-select" id="tipo" value={valores.tipo} onChange={(evento) => cambiar("tipo", evento.target.value)}>
                {PERFILES.map((item) => (
                  <option key={item.id} value={item.id}>{item.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Direccion</legend>
          <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} errores={errores} />
          <CampoTexto id="direccion" label="Direccion" value={valores.direccion} onChange={cambiar} error={errores.direccion} obligatorio maxLength="300" />
        </fieldset>

        <div className="bt-admin-acciones-form">
          <Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link>
          <button className="btn btn-primary" type="submit">{editando ? "Guardar cambios" : "Crear usuario"}</button>
        </div>
      </form>
    </>
  );
}
