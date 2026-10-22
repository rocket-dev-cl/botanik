/**
 * Botanik — Funciones de apoyo del administrador.
 * Traducen ids guardados en los datos (categoria, region, estado) al nombre
 * que se muestra en pantalla.
 */

import { db } from "../../services/db.js";

export const PERFILES = [
  { id: "administrador", nombre: "Administrador" },
  { id: "vendedor", nombre: "Vendedor" },
  { id: "cliente", nombre: "Cliente" }
];

export function nombreCategoria(id) {
  const categoria = db.getCategoria(id);
  return categoria ? categoria.nombre : id;
}

export function nombreRegion(id) {
  const region = db.getRegiones().find((item) => item.id === id);
  return region ? region.nombre : "";
}

export function nombreComuna(idRegion, idComuna) {
  const comuna = db.getComunas(idRegion).find((item) => item.id === idComuna);
  return comuna ? comuna.nombre : "";
}

export function nombreEstado(id) {
  const estado = db.getEstadosOrden().find((item) => item.id === id);
  return estado ? estado.nombre : id;
}

export function enStockCritico(producto) {
  const critico = Number(producto.stockCritico);
  return Number.isFinite(critico) && Number(producto.stock) <= critico;
}

/* Busqueda sin distinguir mayusculas en varios campos de un registro. */
export function coincide(registro, campos, texto) {
  const buscado = texto.trim().toLowerCase();

  if (buscado === "") {
    return true;
  }

  return campos.some((campo) => String(registro[campo] || "").toLowerCase().includes(buscado));
}
