/**
 * Botanik — Crear y editar un producto.
 *
 * El mismo formulario sirve para las dos cosas: si la URL trae un codigo
 * (/admin/productos/PL-001/editar) carga ese producto y el codigo queda fijo;
 * si no, parte vacio. Los valores viven en un solo objeto de estado y cada
 * campo lo actualiza por su id.
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/db.js";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import CampoTexto from "../../components/CampoTexto.jsx";

const VACIO = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  stock: "",
  stockCritico: "",
  categoria: "",
  subcategoria: "",
  etiquetas: [],
  imagen: ""
};

/* Los numeros se editan como texto y se convierten recien al guardar. */
function aFormulario(producto) {
  return {
    ...VACIO,
    ...producto,
    precio: String(producto.precio),
    precioOferta: producto.precioOferta ? String(producto.precioOferta) : "",
    stock: String(producto.stock),
    stockCritico: producto.stockCritico === undefined ? "" : String(producto.stockCritico),
    etiquetas: producto.etiquetas || []
  };
}

function precioOferta(valor, valores) {
  if (String(valor).trim() === "") {
    return { valido: true, mensaje: "" };
  }

  const base = Validaciones.precio(valor);
  if (!base.valido) {
    return base;
  }

  if (Number(valor) >= Number(valores.precio)) {
    return { valido: false, mensaje: "El precio de oferta debe ser menor que el precio normal." };
  }

  return { valido: true, mensaje: "" };
}

const REGLAS = {
  codigo: Validaciones.codigoProducto,
  nombre: Validaciones.nombreProducto,
  descripcion: Validaciones.descripcion,
  precio: Validaciones.precio,
  precioOferta: precioOferta,
  stock: Validaciones.stock,
  stockCritico: Validaciones.stockCritico,
  categoria: (valor) => Validaciones.seleccion(valor, "una categoria"),
  subcategoria: (valor) => Validaciones.seleccion(valor, "una subcategoria")
};

export default function ProductoForm() {
  const { codigo } = useParams();
  const navegar = useNavigate();
  const { notificar } = useNotificacion();
  const existente = codigo ? db.getProducto(codigo) : null;
  const editando = Boolean(codigo);

  const [valores, setValores] = useState(existente ? aFormulario(existente) : VACIO);
  const [errores, setErrores] = useState({});

  if (editando && !existente) {
    return (
      <div className="bt-vacio">
        <h1 className="h4">No encontramos el producto {codigo}</h1>
        <Link className="btn btn-primary" to="/admin/productos">Volver al listado</Link>
      </div>
    );
  }

  const categoria = db.getCategoria(valores.categoria);
  const subcategorias = categoria ? categoria.subcategorias : [];
  const etiquetas = db.getEtiquetas().filter((etiqueta) => etiqueta.categoria === valores.categoria);

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  /* Al cambiar de categoria la subcategoria y las etiquetas anteriores dejan de
     tener sentido, asi que se limpian. */
  function cambiarCategoria(evento) {
    setValores((actuales) => ({ ...actuales, categoria: evento.target.value, subcategoria: "", etiquetas: [] }));
  }

  function alternarEtiqueta(id) {
    setValores((actuales) => ({
      ...actuales,
      etiquetas: actuales.etiquetas.includes(id)
        ? actuales.etiquetas.filter((item) => item !== id)
        : [...actuales.etiquetas, id]
    }));
  }

  function guardar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const producto = {
      ...valores,
      codigo: valores.codigo.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      precioOferta: valores.precioOferta === "" ? undefined : Number(valores.precioOferta),
      stock: Number(valores.stock),
      stockCritico: valores.stockCritico === "" ? undefined : Number(valores.stockCritico),
      imagen: valores.imagen.trim()
    };

    const respuesta = editando
      ? db.actualizarProducto(codigo, producto)
      : db.crearProducto(producto);

    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");

    if (respuesta.ok) {
      navegar("/admin/productos");
    }
  }

  return (
    <>
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin">Administracion</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{editando ? "Editar" : "Nuevo"}</li>
        </ol>
      </nav>

      <div className="bt-admin-encabezado">
        <h1>{editando ? "Editar " + existente.nombre : "Nuevo producto"}</h1>
      </div>

      <form className="bt-admin-form" onSubmit={guardar} noValidate>
        <fieldset>
          <legend>Datos del producto</legend>
          <div className="row">
            <div className="col-12 col-md-4">
              <CampoTexto id="codigo" label="Codigo" value={valores.codigo} onChange={cambiar} error={errores.codigo} obligatorio readOnly={editando} placeholder="PL-024" />
            </div>
            <div className="col-12 col-md-8">
              <CampoTexto id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} obligatorio maxLength="100" />
            </div>
          </div>
          <CampoTexto id="descripcion" label="Descripcion" como="textarea" rows="3" value={valores.descripcion} onChange={cambiar} error={errores.descripcion} maxLength="500" />
        </fieldset>

        <fieldset>
          <legend>Precio y stock</legend>
          <div className="row">
            <div className="col-6 col-md-3">
              <CampoTexto id="precio" label="Precio" type="number" min="0" value={valores.precio} onChange={cambiar} error={errores.precio} obligatorio ayuda="0 = producto gratis" />
            </div>
            <div className="col-6 col-md-3">
              <CampoTexto id="precioOferta" label="Precio oferta" type="number" min="0" value={valores.precioOferta} onChange={cambiar} error={errores.precioOferta} ayuda="Vacio = sin oferta" />
            </div>
            <div className="col-6 col-md-3">
              <CampoTexto id="stock" label="Stock" type="number" min="0" value={valores.stock} onChange={cambiar} error={errores.stock} obligatorio />
            </div>
            <div className="col-6 col-md-3">
              <CampoTexto id="stockCritico" label="Stock critico" type="number" min="0" value={valores.stockCritico} onChange={cambiar} error={errores.stockCritico} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Clasificacion</legend>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label" htmlFor="categoria">Categoria<span className="bt-obligatorio" aria-hidden="true"> *</span></label>
              <select className={"form-select" + (errores.categoria ? " is-invalid" : "")} id="categoria" value={valores.categoria} onChange={cambiarCategoria}>
                <option value="">Selecciona una categoria</option>
                {db.getCategorias().map((item) => (
                  <option key={item.id} value={item.id}>{item.nombre}</option>
                ))}
              </select>
              {errores.categoria && <div className="invalid-feedback d-block">{errores.categoria}</div>}
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label" htmlFor="subcategoria">Subcategoria<span className="bt-obligatorio" aria-hidden="true"> *</span></label>
              <select className={"form-select" + (errores.subcategoria ? " is-invalid" : "")} id="subcategoria" value={valores.subcategoria} onChange={(evento) => cambiar("subcategoria", evento.target.value)} disabled={valores.categoria === ""}>
                <option value="">{valores.categoria === "" ? "Primero elige la categoria" : "Selecciona una subcategoria"}</option>
                {subcategorias.map((item) => (
                  <option key={item.id} value={item.id}>{item.nombre}</option>
                ))}
              </select>
              {errores.subcategoria && <div className="invalid-feedback d-block">{errores.subcategoria}</div>}
            </div>
          </div>

          {etiquetas.length > 0 && (
            <div className="mb-3">
              <p className="form-label mb-2">Etiquetas</p>
              <div className="d-flex flex-wrap gap-3">
                {etiquetas.map((etiqueta) => (
                  <div className="form-check" key={etiqueta.id}>
                    <input className="form-check-input" type="checkbox" id={"etiqueta-" + etiqueta.id} checked={valores.etiquetas.includes(etiqueta.id)} onChange={() => alternarEtiqueta(etiqueta.id)} />
                    <label className="form-check-label" htmlFor={"etiqueta-" + etiqueta.id}>{etiqueta.nombre}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CampoTexto id="imagen" label="Imagen" value={valores.imagen} onChange={cambiar} placeholder="img/productos/pl-024.jpg" ayuda="Ruta del archivo dentro de public/" />
        </fieldset>

        <div className="bt-admin-acciones-form">
          <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
          <button className="btn btn-primary" type="submit">{editando ? "Guardar cambios" : "Crear producto"}</button>
        </div>
      </form>
    </>
  );
}
