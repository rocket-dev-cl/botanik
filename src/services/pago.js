/**
 * Botanik — Pago simulado.
 *
 * No hay pasarela real. procesar() decide si el pago se aprueba o se rechaza
 * con dos reglas que se pueden mostrar en vivo:
 *   1. Si el cliente marco "simular pago rechazado", se rechaza.
 *   2. Si algun producto ya no tiene stock suficiente, se rechaza.
 * Si se aprueba, registra la orden y descuenta el stock.
 *
 * Es un objeto y no una funcion suelta para que la prueba del checkout pueda
 * reemplazarlo con spyOn(pago, "procesar") sin tocar los datos reales.
 */

import { db } from "./db.js";

export const pago = {
  procesar({ cliente, lineas, cupon, subtotal, descuento, total, simularRechazo }) {
    if (simularRechazo) {
      return { ok: false, motivo: "El banco rechazo la transaccion." };
    }

    const sinStock = lineas.find((linea) => {
      const producto = db.getProducto(linea.codigo);
      return !producto || producto.stock < linea.cantidad;
    });

    if (sinStock) {
      return { ok: false, motivo: "No queda stock suficiente de " + sinStock.nombre + "." };
    }

    const { dato: orden } = db.crearOrden({
      clienteRun: cliente.run || "",
      clienteNombre: cliente.nombre + " " + cliente.apellidos,
      clienteCorreo: cliente.correo,
      region: cliente.region,
      comuna: cliente.comuna,
      direccion: cliente.calle + (cliente.departamento ? ", " + cliente.departamento : ""),
      indicaciones: cliente.indicaciones,
      cupon: cupon ? cupon.codigo : null,
      subtotal,
      descuento,
      total,
      lineas
    });

    db.descontarStock(lineas);

    return { ok: true, orden };
  }
};
