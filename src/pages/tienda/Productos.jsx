/**
 * Botanik — Catalogo con filtros.
 *
 * Los filtros elegidos son ESTADO de esta pagina (useState). Cada vez que
 * cambian, React vuelve a dibujar y la lista filtrada se recalcula sola: no
 * hay que borrar y volver a pintar la grilla a mano como en la entrega 1.
 *
 * La URL puede traer ?categoria=plantas (enlaces del pie) o ?buscar=texto
 * (buscador de la cabecera).
 */

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filtros from "../../components/Filtros.jsx";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAgregarAlCarrito } from "../../context/CarritoContext.jsx";
import { db } from "../../services/db.js";

const SIN_FILTROS = { categoria: "", subcategoria: "", etiquetas: [] };

export default function Productos() {
  const [parametros, setParametros] = useSearchParams();
  const [filtros, setFiltros] = useState({ ...SIN_FILTROS, categoria: parametros.get("categoria") || "" });
  const alAgregar = useAgregarAlCarrito();

  const busqueda = (parametros.get("buscar") || "").trim().toLowerCase();
  const productos = db.getProductos();

  const resultado = productos.filter((producto) => {
    if (busqueda && !producto.nombre.toLowerCase().includes(busqueda)) {
      return false;
    }
    if (filtros.categoria && producto.categoria !== filtros.categoria) {
      return false;
    }
    if (filtros.subcategoria && producto.subcategoria !== filtros.subcategoria) {
      return false;
    }
    // Con varias etiquetas marcadas, el producto tiene que tenerlas todas.
    const propias = producto.etiquetas || [];
    return filtros.etiquetas.every((etiqueta) => propias.includes(etiqueta));
  });

  function limpiar() {
    setFiltros(SIN_FILTROS);
    setParametros({});
  }

  return (
    <div className="container py-4 py-lg-5">
      <section>
        <h1>Productos</h1>
        <p className="bt-bajada mt-2">Todo el catalogo de Botanik. Combina los filtros para acotar la busqueda.</p>
      </section>

      <section className="mt-4" aria-label="Filtros del catalogo">
        <Filtros filtros={filtros} onChange={setFiltros} onLimpiar={limpiar} />
      </section>

      <section className="mt-4">
        <p className="text-body-secondary small" role="status">
          {busqueda && <>Resultados para "{busqueda}". </>}
          {resultado.length === productos.length
            ? "Mostrando los " + productos.length + " productos del catalogo"
            : "Mostrando " + resultado.length + " de " + productos.length + " productos"}
        </p>
        <ProductGrid productos={resultado} onAgregar={alAgregar} />
      </section>
    </div>
  );
}
