/**
 * Botanik — Perfil del usuario que inicio sesion.
 *
 * Se leen los datos completos desde db (la sesion solo guarda la identidad).
 * El RUN, el correo y el perfil no se cambian aca: se ven, pero los edita un
 * administrador desde el mantenedor de usuarios.
 */

import { useState } from "react";
import { db } from "../../services/db.js";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import CampoTexto from "../../components/CampoTexto.jsx";
import SelectRegionComuna from "../../components/SelectRegionComuna.jsx";

const REGLAS = {
  nombre: Validaciones.nombre,
  apellidos: Validaciones.apellidos,
  region: (valor) => Validaciones.seleccion(valor, "una region"),
  comuna: (valor) => Validaciones.seleccion(valor, "una comuna"),
  direccion: Validaciones.direccion
};

export default function Perfil() {
  const { usuario: sesion, iniciarSesion } = useSesion();
  const { notificar } = useNotificacion();
  const registrado = db.getUsuario(sesion.run) || sesion;

  const [valores, setValores] = useState({
    nombre: registrado.nombre || "",
    apellidos: registrado.apellidos || "",
    region: registrado.region || "",
    comuna: registrado.comuna || "",
    direccion: registrado.direccion || ""
  });
  const [errores, setErrores] = useState({});

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

    const respuesta = db.actualizarUsuario(sesion.run, valores);
    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");

    // El nombre tambien vive en la sesion: se actualiza para que el menu lo refleje.
    if (respuesta.ok) {
      iniciarSesion(respuesta.dato);
    }
  }

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Mi perfil</h1>
          <p className="text-body-secondary mb-0">
            {registrado.correo} &middot; RUN {registrado.run} &middot; <span className={"bt-perfil bt-perfil-" + registrado.tipo}>{registrado.tipo}</span>
          </p>
        </div>
      </div>

      <form className="bt-admin-form" onSubmit={guardar} noValidate>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoTexto id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} obligatorio maxLength="50" />
          </div>
          <div className="col-12 col-md-6">
            <CampoTexto id="apellidos" label="Apellidos" value={valores.apellidos} onChange={cambiar} error={errores.apellidos} obligatorio maxLength="100" />
          </div>
        </div>
        <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} errores={errores} />
        <CampoTexto id="direccion" label="Direccion" value={valores.direccion} onChange={cambiar} error={errores.direccion} obligatorio maxLength="300" />

        <div className="bt-admin-acciones-form">
          <button className="btn btn-primary" type="submit">Guardar cambios</button>
        </div>
      </form>
    </>
  );
}
