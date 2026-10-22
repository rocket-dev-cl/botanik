/**
 * Pruebas de los calculos del carrito. Son funciones puras, asi que se les
 * pasan productos y lineas de ejemplo sin tocar localStorage.
 */

import { precioVigente, calcularDetalle, calcularSubtotal, calcularDescuento, buscarCupon } from "./carrito.js";

const PRODUCTOS = [
  { codigo: "A", nombre: "Normal", precio: 10000 },
  { codigo: "B", nombre: "En oferta", precio: 20000, precioOferta: 15000 }
];

describe("calculos del carrito", () => {
  it("cobra el precio de oferta cuando existe", () => {
    expect(precioVigente(PRODUCTOS[0])).toBe(10000);
    expect(precioVigente(PRODUCTOS[1])).toBe(15000);
  });

  it("calcula el detalle y el subtotal, e ignora productos que ya no existen", () => {
    const detalle = calcularDetalle(
      [{ codigo: "A", cantidad: 2 }, { codigo: "B", cantidad: 1 }, { codigo: "Z", cantidad: 5 }],
      PRODUCTOS
    );

    expect(detalle.length).toBe(2);
    expect(calcularSubtotal(detalle)).toBe(35000);
  });

  it("aplica cupones de porcentaje y de monto con minimo", () => {
    expect(calcularDescuento(35000, buscarCupon("botanik10"))).toBe(3500);
    expect(calcularDescuento(35000, buscarCupon("VERDE5000"))).toBe(5000);
    expect(calcularDescuento(10000, buscarCupon("VERDE5000"))).toBe(0);
    expect(buscarCupon("NOEXISTE")).toBeNull();
  });
});
