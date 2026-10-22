/**
 * Botanik — Calculos del carrito.
 *
 * Son funciones puras: reciben datos y devuelven un resultado, sin leer ni
 * escribir localStorage y sin tocar React. Por eso se pueden probar solas y
 * las reutiliza el contexto del carrito.
 *
 * El carrito guarda solo codigo y cantidad. Nombre, precio e imagen se
 * resuelven contra el catalogo en cada calculo, para que un cambio de precio
 * en el administrador se vea al tiro en el carrito.
 */

export const CUPONES = [
  { codigo: "BOTANIK10", descripcion: "10% de descuento", tipo: "porcentaje", valor: 10 },
  { codigo: "VERDE5000", descripcion: "$5.000 de descuento", tipo: "monto", valor: 5000, minimo: 20000 },
  { codigo: "BIENVENIDA", descripcion: "15% de descuento", tipo: "porcentaje", valor: 15 }
];

/* Si el producto esta en oferta se cobra el precio de oferta. */
export function precioVigente(producto) {
  return producto.precioOferta ?? producto.precio;
}

/* Une cada linea guardada con su producto. Si el administrador elimino un
   producto, su linea deja de aparecer. */
export function calcularDetalle(lineas, productos) {
  return lineas.reduce((detalle, linea) => {
    const producto = productos.find((item) => item.codigo === linea.codigo);

    if (producto) {
      detalle.push({
        producto,
        cantidad: linea.cantidad,
        subtotal: precioVigente(producto) * linea.cantidad
      });
    }

    return detalle;
  }, []);
}

export function calcularSubtotal(detalle) {
  return detalle.reduce((suma, linea) => suma + linea.subtotal, 0);
}

export function calcularDescuento(subtotal, cupon) {
  if (!cupon || (cupon.minimo && subtotal < cupon.minimo)) {
    return 0;
  }

  if (cupon.tipo === "porcentaje") {
    return Math.round(subtotal * (cupon.valor / 100));
  }

  return Math.min(cupon.valor, subtotal);
}

export function buscarCupon(codigo) {
  const limpio = String(codigo || "").trim().toUpperCase();
  return CUPONES.find((cupon) => cupon.codigo === limpio) || null;
}
