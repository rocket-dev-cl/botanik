/**
 * Botanik — Crear y editar una categoria.
 *
 * El identificador se escribe solo al crear (va en las URL y en cada producto)
 * y queda fijo al editar. Las subcategorias se escriben separadas por coma y
 * se convierten en { id, nombre } al guardar.
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/db.js";
import { validarFormulario } from "../../services/validaciones.js";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import CampoTexto from "../../components/CampoTexto.jsx";

/* "Sustratos y Fertilizantes" -> "sustratos-y-fertilizantes" */
function aIdentificador(texto) {
  return texto.trim().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const REGLAS = {
  id: (valor) => (/^[a-z0-9-]{3,}$/.test(valor)
    ? { valido: true, mensaje: "" }
    : { valido: false, mensaje: "Usa al menos 3 caracteres: minusculas, numeros y guiones." }),
  nombre: (valor) => (String(valor).trim() === ""
    ? { valido: false, mensaje: "Ingresa el nombre de la categoria." }
    : { valido: true, mensaje: "" })
};

export default function CategoriaForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { notificar } = useNotificacion();
  const existente = id ? db.getCategoria(id) : null;
  const editando = Boolean(id);

  const [valores, setValores] = useState({
    id: existente ? existente.id : "",
    nombre: existente ? existente.nombre : "",
    subcategorias: existente ? existente.subcategorias.map((sub) => sub.nombre).join(", ") : ""
  });
  const [errores, setErrores] = useState({});

  if (editando && !existente) {
    return (
      <div className="bt-vacio">
        <h1 className="h4">No encontramos esa categoria</h1>
        <Link className="btn btn-primary" to="/admin/categorias">Volver al listado</Link>
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

    const categoria = {
      id: valores.id,
      nombre: valores.nombre.trim(),
      subcategorias: valores.subcategorias
        .split(",")
        .map((nombre) => nombre.trim())
        .filter((nombre) => nombre !== "")
        .map((nombre) => ({ id: aIdentificador(nombre), nombre }))
    };

    const respuesta = editando
      ? db.actualizarCategoria(id, categoria)
      : db.crearCategoria(categoria);

    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");

    if (respuesta.ok) {
      navegar("/admin/categorias");
    }
  }

  return (
    <>
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Administracion</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/categorias">Categorias</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{editando ? "Editar" : "Nueva"}</li>
        </ol>
      </nav>

      <div className="bt-admin-encabezado">
        <h1>{editando ? "Editar " + existente.nombre : "Nueva categoria"}</h1>
      </div>

      <form className="bt-admin-form" onSubmit={guardar} noValidate>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoTexto id="nombre" label="Nombre" value={valores.nombre} onChange={(campo, valor) => {
              cambiar(campo, valor);
              if (!editando) {
                cambiar("id", aIdentificador(valor));
              }
            }} error={errores.nombre} obligatorio maxLength="50" />
          </div>
          <div className="col-12 col-md-6">
            <CampoTexto id="id" label="Identificador" value={valores.id} onChange={cambiar} error={errores.id} obligatorio readOnly={editando} ayuda="Se usa en la URL: /categorias/identificador" />
          </div>
        </div>
        <CampoTexto id="subcategorias" label="Subcategorias" value={valores.subcategorias} onChange={cambiar} ayuda="Separadas por coma. Ejemplo: Interior, Exterior" />

        <div className="bt-admin-acciones-form">
          <Link className="btn btn-outline-secondary" to="/admin/categorias">Cancelar</Link>
          <button className="btn btn-primary" type="submit">{editando ? "Guardar cambios" : "Crear categoria"}</button>
        </div>
      </form>
    </>
  );
}
