/**
 * Pruebas del pago simulado. Se usan los datos de fabrica: localStorage se
 * limpia antes de cada prueba.
 */

import { pago } from "./pago.js";
import { db } from "./db.js";

const CLIENTE = {
  nombre: "Pedro", apellidos: "Soto", correo: "pedro@gmail.com",
  calle: "Los Crisantemos 123", departamento: "603", region: "13", comuna: "13101", indicaciones: ""
};

function compra(cantidad, simularRechazo = false) {
  return {
    cliente: CLIENTE,
    lineas: [{ codigo: "PL-001", nombre: "Monstera deliciosa", precio: 24990, cantidad }],
    cupon: null, subtotal: 24990 * cantidad, descuento: 0, total: 24990 * cantidad,
    simularRechazo
  };
}

describe("pago.procesar", () => {
  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it("aprueba la compra, registra la orden y descuenta el stock", () => {
    const stock = db.getProducto("PL-001").stock;
    const respuesta = pago.procesar(compra(2));

    expect(respuesta.ok).toBeTrue();
    expect(db.getOrden(respuesta.orden.numero).direccion).toBe("Los Crisantemos 123, 603");
    expect(db.getProducto("PL-001").stock).toBe(stock - 2);
  });

  it("rechaza si se pide simular el rechazo y no crea la orden", () => {
    const ordenes = db.getOrdenes().length;
    const respuesta = pago.procesar(compra(1, true));

    expect(respuesta.ok).toBeFalse();
    expect(db.getOrdenes().length).toBe(ordenes);
  });

  it("rechaza si no queda stock suficiente", () => {
    const respuesta = pago.procesar(compra(9999));

    expect(respuesta.ok).toBeFalse();
    expect(respuesta.motivo).toContain("stock");
  });
});
