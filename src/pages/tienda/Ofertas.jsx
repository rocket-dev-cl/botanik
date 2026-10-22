/**
 * Botanik — Productos en oferta.
 *
 * Un producto esta en oferta cuando tiene precioOferta. Si el administrador se
 * lo agrega o se lo quita, la lista cambia sin tocar esta pagina.
 */

import ProductGrid from "../../components/ProductGrid.jsx";
import { useAgregarAlCarrito } from "../../context/CarritoContext.jsx";
import { db } from "../../services/db.js";

export default function Ofertas() {
  const alAgregar = useAgregarAlCarrito();
  const ofertas = db.getProductos().filter((producto) => producto.precioOferta !== undefined);

  return (
    <div className="container py-4 py-lg-5">
      <section>
        <h1>Ofertas</h1>
        <p className="bt-bajada mt-2">Productos con precio rebajado mientras dure el stock.</p>
      </section>

      <section className="mt-4">
        <ProductGrid productos={ofertas} onAgregar={alAgregar} mensajeVacio="No hay ofertas vigentes" />
      </section>
    </div>
  );
}
