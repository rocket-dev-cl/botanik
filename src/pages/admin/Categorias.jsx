/**
 * Botanik — Listado de categorias.
 * Una categoria con productos no se puede eliminar: db lo rechaza y el motivo
 * se muestra en un aviso.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/db.js";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";

export default function Categorias() {
  const { notificar } = useNotificacion();
  const [porEliminar, setPorEliminar] = useState(null);

  const categorias = db.getCategorias();
  const productos = db.getProductos();

  function eliminar() {
    const respuesta = db.eliminarCategoria(porEliminar.id);
    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");
    setPorEliminar(null);
  }

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Categorias</h1>
          <p className="text-body-secondary mb-0">Organizan el catalogo y el menu de la tienda.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/categorias/nueva">Nueva categoria</Link>
      </div>

      <div className="bt-tabla-envoltorio">
        <table className="table bt-tabla">
          <caption className="visually-hidden">Categorias del catalogo</caption>
          <thead>
            <tr>
              <th scope="col">Identificador</th>
              <th scope="col">Nombre</th>
              <th scope="col">Subcategorias</th>
              <th scope="col" className="bt-num">Productos</th>
              <th scope="col" className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.subcategorias.map((sub) => sub.nombre).join(", ")}</td>
                <td className="bt-num">{productos.filter((producto) => producto.categoria === categoria.id).length}</td>
                <td>
                  <div className="bt-acciones">
                    <Link className="btn btn-outline-primary btn-sm" to={"/admin/categorias/" + categoria.id + "/editar"}>Editar</Link>
                    <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => setPorEliminar(categoria)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirmacion
        abierto={porEliminar !== null}
        titulo="Eliminar categoria"
        mensaje={porEliminar ? "Se eliminara la categoria " + porEliminar.nombre + "." : ""}
        textoAceptar="Eliminar"
        onAceptar={eliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
