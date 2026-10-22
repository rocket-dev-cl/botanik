/**
 * Botanik — Portada.
 *
 * Hero, los 8 productos marcados como destacados y un acceso por categoria.
 * Los productos se leen desde db, asi que si el administrador quita la marca
 * de destacado a un producto, deja de aparecer aca.
 */

import { Link } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAgregarAlCarrito } from "../../context/CarritoContext.jsx";
import { db } from "../../services/db.js";

export default function Home() {
  const alAgregar = useAgregarAlCarrito();
  const productos = db.getProductos();
  const destacados = productos.filter((producto) => producto.destacado === true).slice(0, 8);
  const categorias = db.getCategorias();

  return (
    <>
      <section className="bt-hero">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <p className="bt-titulo-seccion mb-2">Vivero con despacho a todo Chile</p>
              <h1>Plantas que sobreviven a un departamento</h1>
              <p className="lead mt-3">Cada ficha dice cuanta luz necesita y cada cuanto se riega. Elegimos especies que aguantan un olvido y crecen igual, para que la planta dure mas que el entusiasmo.</p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link className="btn btn-primary btn-lg" to="/productos">Ver productos</Link>
                <Link className="btn btn-outline-primary btn-lg" to="/ofertas">Ver ofertas</Link>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <img className="bt-hero-img" src="/img/ui/hero.jpg" alt="Rincon de un departamento con plantas de interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="bt-seccion">
        <div className="container">
          <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-4">
            <h2 className="bt-titulo-seccion mb-0">Destacados del mes</h2>
            <Link to="/productos">Ver todo el catalogo</Link>
          </div>
          <ProductGrid productos={destacados} onAgregar={alAgregar} />
        </div>
      </section>

      <section className="bt-seccion pt-0">
        <div className="container">
          <h2 className="bt-titulo-seccion mb-4">Por categoria</h2>
          <div className="row g-3">
            {categorias.map((categoria) => {
              const cuantos = productos.filter((producto) => producto.categoria === categoria.id).length;
              const subcategorias = categoria.subcategorias.map((sub) => sub.nombre).join(" y ");

              return (
                <div className="col-6 col-lg-3" key={categoria.id}>
                  <Link className="bt-categoria-tarjeta" to={"/categorias/" + categoria.id}>
                    <strong>{categoria.nombre}</strong>
                    <span>{cuantos} productos{subcategorias && " · " + subcategorias}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
