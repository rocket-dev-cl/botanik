/**
 * Botanik — Carrito de compras.
 *
 * Toma todo del contexto del carrito: las lineas, los totales y las funciones
 * para cambiarlos. Las lineas las dibuja CarritoItem y el resumen con el cupon
 * lo dibuja ResumenCompra.
 */

import { Link, useNavigate } from "react-router-dom";
import CarritoItem from "../../components/CarritoItem.jsx";
import ResumenCompra from "../../components/ResumenCompra.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { useNotificacion } from "../../context/NotificacionContext.jsx";

export default function Carrito() {
  const carrito = useCarrito();
  const { notificar } = useNotificacion();
  const navegar = useNavigate();

  function cambiarCantidad(codigo, cantidad) {
    // Bajar de 1 no elimina la linea: para eso esta el boton Eliminar.
    if (cantidad < 1) {
      return;
    }

    const resultado = carrito.cambiarCantidad(codigo, cantidad);

    if (!resultado.ok) {
      notificar(resultado.mensaje, "error");
    }
  }

  function limpiar() {
    carrito.vaciar();
    notificar("Vaciaste el carrito.", "aviso");
  }

  if (carrito.detalle.length === 0) {
    return (
      <div className="container py-4 py-lg-5">
        <h1>Mi carrito de compras</h1>
        <div className="bt-vacio mt-4">
          <h2 className="h5">Tu carrito esta vacio</h2>
          <p>Cuando agregues productos apareceran aca y se guardaran aunque cierres el navegador.</p>
          <Link className="btn btn-primary" to="/productos">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5">
      <h1>Mi carrito de compras</h1>

      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-8">
          <section aria-label="Productos en el carrito">
            {carrito.detalle.map((linea) => (
              <CarritoItem key={linea.producto.codigo} linea={linea}
                onCambiarCantidad={cambiarCantidad} onEliminar={carrito.eliminar} />
            ))}
            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link className="btn btn-outline-primary" to="/productos">Seguir comprando</Link>
              <button className="btn btn-outline-secondary" type="button" onClick={limpiar}>Limpiar</button>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-4">
          <ResumenCompra
            cantidad={carrito.cantidadTotal}
            subtotal={carrito.subtotal}
            descuento={carrito.descuento}
            total={carrito.total}
            cupon={carrito.cupon}
            onAplicarCupon={carrito.aplicarCupon}
            onQuitarCupon={carrito.quitarCupon}
          >
            <button className="btn btn-primary btn-lg w-100 mt-3" type="button" onClick={() => navegar("/checkout")}>
              Comprar ahora
            </button>
          </ResumenCompra>
        </div>
      </div>
    </div>
  );
}
