/**
 * Botanik — Grilla de productos.
 *
 * Recibe un arreglo y dibuja una tarjeta por producto con .map(). Si el arreglo
 * viene vacio muestra un aviso en vez de una grilla en blanco. Las columnas
 * cambian segun el ancho: 2 en celular, 3 en tablet y 4 en escritorio.
 */

import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ productos, onAgregar, mensajeVacio = "No hay productos que coincidan" }) {
  if (productos.length === 0) {
    return (
      <div className="bt-vacio">
        <h2 className="h5">{mensajeVacio}</h2>
        <p className="mb-0">Prueba con menos filtros o vuelve a todas las categorias.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
      {productos.map((producto) => (
        <div className="col" key={producto.codigo}>
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
