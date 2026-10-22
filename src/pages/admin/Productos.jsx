/**
 * Botanik — Listado de productos del administrador.
 *
 * Estado del componente: el texto buscado, la categoria elegida y el producto
 * que se esta por eliminar. La lista no se guarda en el estado: se lee de db en
 * cada render y se filtra, asi siempre muestra lo ultimo guardado.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/db.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";
import TablaProductos from "./TablaProductos.jsx";
import { coincide } from "./utilidades.js";

export default function Productos() {
  const { esAdministrador } = useSesion();
  const { notificar } = useNotificacion();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);

  const productos = db.getProductos().filter((producto) =>
    (categoria === "" || producto.categoria === categoria) &&
    coincide(producto, ["codigo", "nombre"], busqueda));

  function eliminar() {
    const respuesta = db.eliminarProducto(porEliminar.codigo);
    notificar(respuesta.mensaje, respuesta.ok ? "exito" : "error");
    setPorEliminar(null);
  }

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Productos</h1>
          <p className="text-body-secondary mb-0">Catalogo completo de la tienda.</p>
        </div>
        {esAdministrador && <Link className="btn btn-primary" to="/admin/productos/nuevo">Nuevo producto</Link>}
      </div>

      <form className="row g-2 mb-3" onSubmit={(evento) => evento.preventDefault()}>
        <div className="col-12 col-md-6">
          <label className="visually-hidden" htmlFor="buscadorProductos">Buscar producto</label>
          <input className="form-control" type="search" id="buscadorProductos" placeholder="Buscar por codigo o nombre" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <label className="visually-hidden" htmlFor="filtroCategoriaAdmin">Filtrar por categoria</label>
          <select className="form-select" id="filtroCategoriaAdmin" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
            <option value="">Todas las categorias</option>
            {db.getCategorias().map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
      </form>

      <TablaProductos productos={productos} puedeEditar={esAdministrador} onEliminar={setPorEliminar} />
      <p className="text-body-secondary small" role="status">{productos.length} productos</p>

      <ModalConfirmacion
        abierto={porEliminar !== null}
        titulo="Eliminar producto"
        mensaje={porEliminar ? "Se eliminara " + porEliminar.nombre + " (" + porEliminar.codigo + ") del catalogo." : ""}
        textoAceptar="Eliminar"
        onAceptar={eliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
