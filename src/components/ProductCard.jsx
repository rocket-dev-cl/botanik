/**
 * Botanik — Tarjeta de un producto.
 *
 * Recibe el producto y la funcion onAgregar por props. La tarjeta no sabe nada
 * del carrito: solo avisa "quieren agregar este codigo" y la pagina que la usa
 * decide que hacer. Asi la misma tarjeta sirve en el Home, el catalogo, las
 * categorias, las ofertas y los relacionados del detalle.
 */

import { Link } from "react-router-dom";
import Boton from "./Boton.jsx";
import Precio from "./Precio.jsx";
import { db } from "../services/db.js";
import { rutaImagen } from "../services/formato.js";

function nombreEtiqueta(id) {
  const etiqueta = db.getEtiquetas().find((item) => item.id === id);
  return etiqueta ? etiqueta.nombre : id;
}

export default function ProductCard({ producto, onAgregar }) {
  const enlace = "/producto/" + producto.codigo;
  const etiquetas = producto.etiquetas || [];
  const enOferta = producto.precioOferta !== undefined;

  return (
    <article className="bt-producto">
      {enOferta && <span className="bt-producto-etiqueta-foto bt-oferta">Oferta</span>}
      {!enOferta && etiquetas.length > 0 && (
        <span className="bt-producto-etiqueta-foto">{nombreEtiqueta(etiquetas[0])}</span>
      )}

      <Link className="bt-producto-figura" to={enlace} tabIndex="-1" aria-hidden="true">
        <img className="bt-producto-img" src={rutaImagen(producto.imagen)} alt={producto.nombre} loading="lazy" />
      </Link>

      <div className="bt-producto-cuerpo">
        <h3 className="bt-producto-nombre">
          <Link to={enlace}>{producto.nombre}</Link>
        </h3>
        <div className="bt-producto-pie">
          <Precio producto={producto} />
          {producto.stock === 0 ? (
            <span className="bt-agotado">Agotado</span>
          ) : (
            <Boton
              etiqueta="+"
              className="btn-sm bt-producto-agregar"
              aria-label={"Anadir " + producto.nombre + " al carrito"}
              onClick={() => onAgregar(producto.codigo)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
