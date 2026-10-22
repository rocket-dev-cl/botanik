/**
 * Botanik — Detalle de un producto.
 *
 * El codigo llega en la URL (/producto/PL-001). La imagen elegida de la
 * galeria y la cantidad son estado propio de esta pagina.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Precio from "../../components/Precio.jsx";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAgregarAlCarrito } from "../../context/CarritoContext.jsx";
import { db } from "../../services/db.js";
import { rutaImagen } from "../../services/formato.js";

export default function DetalleProducto() {
  const { codigo } = useParams();
  const producto = db.getProducto(codigo);
  const alAgregar = useAgregarAlCarrito();

  const [imagenElegida, setImagenElegida] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  // Al pasar a un producto relacionado la pagina no se vuelve a montar:
  // se reinician a mano la foto elegida y la cantidad.
  useEffect(() => {
    setImagenElegida(0);
    setCantidad(1);
  }, [codigo]);

  if (!producto) {
    return (
      <div className="container py-5">
        <div className="bt-vacio">
          <h1 className="h4">No encontramos ese producto</h1>
          <p>Es posible que haya salido del catalogo.</p>
          <Link className="btn btn-primary" to="/productos">Volver al catalogo</Link>
        </div>
      </div>
    );
  }

  const categoria = db.getCategoria(producto.categoria);
  const galeria = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen];
  const etiquetas = db.getEtiquetas().filter((etiqueta) => (producto.etiquetas || []).includes(etiqueta.id));
  const relacionados = db.getProductos()
    .filter((item) => item.categoria === producto.categoria && item.codigo !== producto.codigo)
    .slice(0, 4);

  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={"/categorias/" + producto.categoria}>{categoria ? categoria.nombre : "Productos"}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <article className="row g-4 g-lg-5">
        <div className="col-12 col-lg-6">
          <img className="bt-galeria-principal" src={rutaImagen(galeria[imagenElegida])} alt={producto.nombre} />
          {galeria.length > 1 && (
            <div className="bt-galeria-miniaturas">
              {galeria.map((ruta, indice) => (
                <img key={ruta} className={"bt-miniatura" + (indice === imagenElegida ? " activa" : "")}
                  src={rutaImagen(ruta)} alt={"Vista " + (indice + 1) + " de " + producto.nombre}
                  onClick={() => setImagenElegida(indice)} />
              ))}
            </div>
          )}
        </div>

        <div className="col-12 col-lg-6">
          <p className="bt-titulo-seccion mb-2">{producto.codigo}{categoria && " · " + categoria.nombre}</p>
          <h1>{producto.nombre}</h1>
          <p className="bt-detalle-precio mt-3 mb-3"><Precio producto={producto} /></p>
          <p className="text-body-secondary">{producto.descripcion || "Este producto todavia no tiene descripcion."}</p>

          {etiquetas.length > 0 && (
            <ul className="list-unstyled d-flex flex-wrap gap-2 mt-3 mb-3">
              {etiquetas.map((etiqueta) => <li className="bt-etiqueta" key={etiqueta.id}>{etiqueta.nombre}</li>)}
            </ul>
          )}

          {producto.stock === 0 ? (
            <p className="bt-agotado">Sin stock por ahora.</p>
          ) : (
            <>
              <p className="text-body-secondary small">{producto.stock} unidades disponibles · despacho en 2 a 4 dias habiles</p>
              <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
                <div className="input-group bt-cantidad">
                  <button className="btn btn-outline-secondary" type="button" aria-label="Quitar una unidad"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}>&minus;</button>
                  <input className="form-control" type="text" value={cantidad} readOnly aria-label="Cantidad" />
                  <button className="btn btn-outline-secondary" type="button" aria-label="Agregar una unidad"
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" type="button" onClick={() => alAgregar(producto.codigo, cantidad)}>
                  Anadir al carrito
                </button>
              </div>
            </>
          )}
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="bt-seccion">
          <h2 className="bt-titulo-seccion mb-4">Tambien de esta categoria</h2>
          <ProductGrid productos={relacionados} onAgregar={alAgregar} />
        </section>
      )}
    </div>
  );
}
