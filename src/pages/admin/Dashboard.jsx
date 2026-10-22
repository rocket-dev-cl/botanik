/**
 * Botanik — Panel principal del administrador (Figura 9).
 *
 * Tres indicadores calculados desde db y accesos directos a cada seccion. Los
 * accesos se filtran por perfil, igual que el menu lateral.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../services/db.js";
import { formatearPrecio } from "../../services/formato.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";
import { enStockCritico } from "./utilidades.js";

const ACCESOS = [
  { ruta: "/admin/ordenes", titulo: "Ordenes", texto: "Gestion y seguimiento de las ordenes de compra.", soloAdmin: false },
  { ruta: "/admin/productos", titulo: "Productos", texto: "Inventario y detalle de los productos del catalogo.", soloAdmin: false },
  { ruta: "/admin/productos-criticos", titulo: "Productos criticos", texto: "Productos que llegaron a su stock critico.", soloAdmin: false },
  { ruta: "/admin/categorias", titulo: "Categorias", texto: "Organizar los productos en categorias.", soloAdmin: true },
  { ruta: "/admin/usuarios", titulo: "Usuarios", texto: "Cuentas de usuario y su perfil de acceso.", soloAdmin: true },
  { ruta: "/admin/reportes", titulo: "Reportes", texto: "Resumen de ventas por estado, categoria y producto.", soloAdmin: true },
  { ruta: "/admin/perfil", titulo: "Perfil", texto: "Tus datos personales y de contacto.", soloAdmin: false },
  { ruta: "/", titulo: "Tienda", texto: "Ver la tienda tal como la ve un cliente.", soloAdmin: false }
];

export default function Dashboard() {
  const { usuario, esAdministrador } = useSesion();
  const { notificar } = useNotificacion();
  const [confirmando, setConfirmando] = useState(false);
  // Al restaurar se cambia esta marca para que el panel vuelva a leer los datos.
  const [, setVersion] = useState(0);

  const ordenes = db.getOrdenes();
  const productos = db.getProductos();
  const usuarios = db.getUsuarios();
  const criticos = productos.filter(enStockCritico);

  const totalVendido = ordenes
    .filter((orden) => orden.estado !== "cancelada")
    .reduce((suma, orden) => suma + orden.total, 0);
  const stockTotal = productos.reduce((suma, producto) => suma + Number(producto.stock), 0);

  function restaurar() {
    db.restaurar();
    setConfirmando(false);
    setVersion((valor) => valor + 1);
    notificar("Se restauraron los datos de fabrica.", "exito");
  }

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Hola, {usuario.nombre}</h1>
          <p className="text-body-secondary mb-0">Resumen de las actividades de la tienda.</p>
        </div>
        {esAdministrador && (
          <button className="btn btn-outline-secondary" type="button" onClick={() => setConfirmando(true)}>Restaurar datos</button>
        )}
      </div>

      {criticos.length > 0 && (
        <div className="alert alert-warning" role="status">
          {criticos.length === 1 ? "1 producto alcanzo" : criticos.length + " productos alcanzaron"} su stock critico.
          <Link className="alert-link ms-1" to="/admin/productos-criticos">Revisar</Link>
        </div>
      )}

      <section aria-labelledby="tituloIndicadores">
        <h2 className="visually-hidden" id="tituloIndicadores">Indicadores</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="bt-tarjeta-indicador">
              <strong>{ordenes.length}</strong>
              <span>compras &middot; {formatearPrecio(totalVendido)} vendidos</span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="bt-tarjeta-indicador">
              <strong>{productos.length}</strong>
              <span>productos &middot; {stockTotal} unidades en inventario</span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="bt-tarjeta-indicador">
              <strong>{usuarios.length}</strong>
              <span>usuarios registrados</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5" aria-labelledby="tituloAccesos">
        <h2 className="bt-titulo-seccion" id="tituloAccesos">Accesos</h2>
        <div className="row g-3 mt-1">
          {ACCESOS.filter((acceso) => esAdministrador || !acceso.soloAdmin).map((acceso) => (
            <div className="col-12 col-sm-6 col-xl-3" key={acceso.ruta}>
              <article className="bt-tarjeta-indicador h-100">
                <h3 className="h6">{acceso.titulo}</h3>
                <p className="text-body-secondary small">{acceso.texto}</p>
                <Link className="btn btn-primary btn-sm" to={acceso.ruta}>Ir a {acceso.titulo.toLowerCase()}</Link>
              </article>
            </div>
          ))}
        </div>
      </section>

      <ModalConfirmacion
        abierto={confirmando}
        titulo="Restaurar datos"
        mensaje="Se borraran todos los cambios hechos en productos, categorias, usuarios y ordenes. Esta accion no se puede deshacer."
        textoAceptar="Restaurar"
        onAceptar={restaurar}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  );
}
