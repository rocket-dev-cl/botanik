/**
 * Botanik — Listado de usuarios.
 * Busqueda por RUN, nombre o correo y filtro por perfil. Desde cada fila se
 * edita el usuario o se ve su historial de compras.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/db.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";
import { coincide, PERFILES } from "./utilidades.js";

export default function Usuarios() {
  const { usuario: sesion } = useSesion();
  const { notificar } = useNotificacion();
  const [busqueda, setBusqueda] = useState("");
  const [perfil, setPerfil] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);

  const usuarios = db.getUsuarios().filter((usuario) =>
    (perfil === "" || usuario.tipo === perfil) &&
    coincide(usuario, ["run", "nombre", "apellidos", "correo"], busqueda));

  function eliminar() {
    const respuesta = db.eliminarUsuario(porEliminar.run);
    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");
    setPorEliminar(null);
  }

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Usuarios</h1>
          <p className="text-body-secondary mb-0">Cuentas registradas y su perfil de acceso.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>

      <form className="row g-2 mb-3" onSubmit={(evento) => evento.preventDefault()}>
        <div className="col-12 col-md-6">
          <label className="visually-hidden" htmlFor="buscadorUsuarios">Buscar usuario</label>
          <input className="form-control" type="search" id="buscadorUsuarios" placeholder="Buscar por RUN, nombre o correo" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <label className="visually-hidden" htmlFor="filtroPerfil">Filtrar por perfil</label>
          <select className="form-select" id="filtroPerfil" value={perfil} onChange={(evento) => setPerfil(evento.target.value)}>
            <option value="">Todos los perfiles</option>
            {PERFILES.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="bt-tabla-envoltorio">
        <table className="table bt-tabla">
          <caption className="visually-hidden">Usuarios del sistema</caption>
          <thead>
            <tr>
              <th scope="col">RUN</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Perfil</th>
              <th scope="col" className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan="5" className="text-center text-body-secondary">Ningun usuario coincide con la busqueda.</td></tr>
            )}
            {usuarios.map((usuario) => (
              <tr key={usuario.run}>
                <td>{usuario.run}</td>
                <td>{usuario.nombre} {usuario.apellidos}</td>
                <td>{usuario.correo}</td>
                <td><span className={"bt-perfil bt-perfil-" + usuario.tipo}>{usuario.tipo}</span></td>
                <td>
                  <div className="bt-acciones">
                    <Link className="btn btn-outline-secondary btn-sm" to={"/admin/usuarios/" + usuario.run + "/historial"}>Compras</Link>
                    <Link className="btn btn-outline-primary btn-sm" to={"/admin/usuarios/" + usuario.run + "/editar"}>Editar</Link>
                    {/* Nadie puede eliminar su propia cuenta mientras la usa. */}
                    {usuario.run !== sesion.run && (
                      <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => setPorEliminar(usuario)}>Eliminar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-body-secondary small" role="status">{usuarios.length} usuarios</p>

      <ModalConfirmacion
        abierto={porEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={porEliminar ? "Se eliminara la cuenta de " + porEliminar.nombre + " " + porEliminar.apellidos + "." : ""}
        textoAceptar="Eliminar"
        onAceptar={eliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
