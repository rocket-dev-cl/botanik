/**
 * Botanik — Reportes de ventas.
 *
 * Todo se calcula en el momento a partir de las ordenes guardadas. Las
 * canceladas no cuentan como venta. Tablas simples, sin graficos.
 */

import { db } from "../../services/db.js";
import { formatearPrecio } from "../../services/formato.js";
import { nombreCategoria } from "./utilidades.js";

/* Suma un monto bajo una clave: { plantas: 50000, maceteros: 12000 } */
function acumular(mapa, clave, cantidad, monto) {
  const actual = mapa[clave] || { cantidad: 0, monto: 0 };
  mapa[clave] = { cantidad: actual.cantidad + cantidad, monto: actual.monto + monto };
  return mapa;
}

export default function Reportes() {
  const ordenes = db.getOrdenes();
  const validas = ordenes.filter((orden) => orden.estado !== "cancelada");
  const productos = db.getProductos();

  const porEstado = db.getEstadosOrden().map((estado) => {
    const delEstado = ordenes.filter((orden) => orden.estado === estado.id);
    return {
      nombre: estado.nombre,
      cantidad: delEstado.length,
      monto: delEstado.reduce((suma, orden) => suma + orden.total, 0)
    };
  });

  const lineas = validas.flatMap((orden) => orden.lineas);

  const porCategoria = lineas.reduce((mapa, linea) => {
    const producto = productos.find((item) => item.codigo === linea.codigo);
    const categoria = producto ? producto.categoria : "sin-categoria";
    return acumular(mapa, categoria, linea.cantidad, linea.precio * linea.cantidad);
  }, {});

  const porProducto = lineas.reduce((mapa, linea) =>
    acumular(mapa, linea.codigo + " · " + linea.nombre, linea.cantidad, linea.precio * linea.cantidad), {});

  const top = Object.entries(porProducto)
    .sort((a, b) => b[1].cantidad - a[1].cantidad)
    .slice(0, 5);

  const totalVendido = validas.reduce((suma, orden) => suma + orden.total, 0);
  const totalDescuentos = validas.reduce((suma, orden) => suma + orden.descuento, 0);

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Reportes</h1>
          <p className="text-body-secondary mb-0">Resumen de ventas calculado desde las ordenes registradas.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="bt-tarjeta-indicador"><strong>{formatearPrecio(totalVendido)}</strong><span>vendido (sin canceladas)</span></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bt-tarjeta-indicador"><strong>{validas.length}</strong><span>ordenes validas</span></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bt-tarjeta-indicador"><strong>{formatearPrecio(totalDescuentos)}</strong><span>en descuentos por cupon</span></div>
        </div>
      </div>

      <div className="row g-4">
        <section className="col-12 col-xl-6">
          <h2 className="bt-titulo-seccion">Ordenes por estado</h2>
          <div className="bt-tabla-envoltorio">
            <table className="table bt-tabla">
              <thead>
                <tr><th scope="col">Estado</th><th scope="col" className="bt-num">Ordenes</th><th scope="col" className="bt-num">Monto</th></tr>
              </thead>
              <tbody>
                {porEstado.map((fila) => (
                  <tr key={fila.nombre}><td>{fila.nombre}</td><td className="bt-num">{fila.cantidad}</td><td className="bt-num">{formatearPrecio(fila.monto)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="col-12 col-xl-6">
          <h2 className="bt-titulo-seccion">Ventas por categoria</h2>
          <div className="bt-tabla-envoltorio">
            <table className="table bt-tabla">
              <thead>
                <tr><th scope="col">Categoria</th><th scope="col" className="bt-num">Unidades</th><th scope="col" className="bt-num">Monto</th></tr>
              </thead>
              <tbody>
                {Object.entries(porCategoria).map(([id, fila]) => (
                  <tr key={id}><td>{nombreCategoria(id)}</td><td className="bt-num">{fila.cantidad}</td><td className="bt-num">{formatearPrecio(fila.monto)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="col-12">
          <h2 className="bt-titulo-seccion">Los 5 productos mas vendidos</h2>
          <div className="bt-tabla-envoltorio">
            <table className="table bt-tabla">
              <thead>
                <tr><th scope="col">Producto</th><th scope="col" className="bt-num">Unidades</th><th scope="col" className="bt-num">Monto</th></tr>
              </thead>
              <tbody>
                {top.map(([nombre, fila]) => (
                  <tr key={nombre}><td>{nombre}</td><td className="bt-num">{fila.cantidad}</td><td className="bt-num">{formatearPrecio(fila.monto)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
