/**
 * Botanik — Productos separados por categoria.
 *
 * Sirve dos rutas: /categorias muestra todas las categorias, una seccion por
 * cada una; /categorias/plantas muestra solo esa. El id llega en la URL y se
 * lee con useParams.
 */

import { Link, useParams } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAgregarAlCarrito } from "../../context/CarritoContext.jsx";
import { db } from "../../services/db.js";

/* Las fotos de las tarjetas se llaman igual que la categoria. Sustratos y
   fertilizantes es la unica con un id compuesto. */
const IMAGENES = {
  plantas: "/img/ui/categoria-plantas.jpg",
  maceteros: "/img/ui/categoria-maceteros.jpg",
  "sustratos-fertilizantes": "/img/ui/categoria-sustratos.jpg",
  herramientas: "/img/ui/categoria-herramientas.jpg"
};

export default function Categorias() {
  const { id } = useParams();
  const alAgregar = useAgregarAlCarrito();
  const categorias = db.getCategorias();
  const productos = db.getProductos();

  const visibles = id ? categorias.filter((categoria) => categoria.id === id) : categorias;

  return (
    <div className="container py-4 py-lg-5">
      <h1>Categorias</h1>

      <div className="row row-cols-2 row-cols-md-4 g-3 mt-2">
        {categorias.map((categoria) => (
          <div className="col" key={categoria.id}>
            <Link className={"card h-100 text-center text-decoration-none bt-categoria-foto" + (categoria.id === id ? " activa" : "")}
              to={"/categorias/" + categoria.id}>
              <img className="card-img-top" src={IMAGENES[categoria.id] || "/img/ui/sin-imagen.svg"} alt="" />
              <div className="card-body py-2">
                <span className="fw-medium">{categoria.nombre}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {visibles.length === 0 && (
        <div className="bt-vacio mt-4">
          <h2 className="h5">Esa categoria no existe</h2>
          <Link to="/categorias">Ver todas las categorias</Link>
        </div>
      )}

      {visibles.map((categoria) => (
        <section className="bt-seccion pb-0" key={categoria.id}>
          <h2 className="mb-4">{categoria.nombre}</h2>
          <ProductGrid
            productos={productos.filter((producto) => producto.categoria === categoria.id)}
            onAgregar={alAgregar}
            mensajeVacio="Todavia no hay productos en esta categoria"
          />
        </section>
      ))}
    </div>
  );
}
