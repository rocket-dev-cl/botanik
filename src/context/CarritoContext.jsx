/**
 * Botanik — Carrito compartido.
 *
 * El carrito lo usan la cabecera (contador), el catalogo (boton Anadir), la
 * vista Carrito y el checkout. Por eso vive en un contexto y no en el estado
 * de una sola pagina.
 *
 * Estado: las lineas { codigo, cantidad } y el codigo del cupon. Cada cambio se
 * guarda en localStorage para que el carrito sobreviva a cerrar el navegador.
 * Los totales no se guardan: se calculan en cada render con services/carrito.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { Almacen, CLAVES, db } from "../services/db.js";
import { formatearPrecio } from "../services/formato.js";
import { useNotificacion } from "./NotificacionContext.jsx";
import {
  buscarCupon,
  calcularDescuento,
  calcularDetalle,
  calcularSubtotal
} from "../services/carrito.js";

const CarritoContext = createContext(null);

function lineasGuardadas() {
  const guardadas = Almacen.leer(CLAVES.carrito, []);

  if (!Array.isArray(guardadas)) {
    return [];
  }

  return guardadas.filter((linea) => linea && typeof linea.codigo === "string" && Number(linea.cantidad) > 0);
}

export function CarritoProvider({ children }) {
  const [lineas, setLineas] = useState(lineasGuardadas);
  const [codigoCupon, setCodigoCupon] = useState(() => Almacen.leer(CLAVES.cupon, null));

  // Cada vez que cambia el estado, se persiste.
  useEffect(() => {
    Almacen.escribir(CLAVES.carrito, lineas);
  }, [lineas]);

  useEffect(() => {
    if (codigoCupon) {
      Almacen.escribir(CLAVES.cupon, codigoCupon);
    } else {
      Almacen.borrar(CLAVES.cupon);
    }
  }, [codigoCupon]);

  // Valores derivados: se recalculan contra el catalogo vigente.
  const detalle = calcularDetalle(lineas, db.getProductos());
  const subtotal = calcularSubtotal(detalle);
  const cupon = buscarCupon(codigoCupon);
  const descuento = calcularDescuento(subtotal, cupon);
  const total = Math.max(0, subtotal - descuento);
  const cantidadTotal = detalle.reduce((suma, linea) => suma + linea.cantidad, 0);

  function agregar(codigo, cantidad = 1) {
    const producto = db.getProducto(codigo);

    if (!producto) {
      return { ok: false, mensaje: "Ese producto ya no esta disponible." };
    }

    if (producto.stock === 0) {
      return { ok: false, mensaje: "Ese producto esta agotado." };
    }

    const cuantos = Math.max(1, Number(cantidad) || 1);
    const existente = lineas.find((linea) => linea.codigo === codigo);
    const yaEnCarrito = existente ? existente.cantidad : 0;

    if (yaEnCarrito + cuantos > producto.stock) {
      return { ok: false, mensaje: "Solo quedan " + producto.stock + " unidades de " + producto.nombre + "." };
    }

    if (existente) {
      setLineas(lineas.map((linea) =>
        linea.codigo === codigo ? { ...linea, cantidad: yaEnCarrito + cuantos } : linea));
    } else {
      setLineas([...lineas, { codigo, cantidad: cuantos }]);
    }

    return { ok: true, mensaje: producto.nombre + " se agrego al carrito." };
  }

  function cambiarCantidad(codigo, cantidad) {
    const producto = db.getProducto(codigo);
    const nueva = Number(cantidad);

    if (!producto) {
      return { ok: false, mensaje: "Esa linea ya no existe." };
    }

    if (!Number.isInteger(nueva) || nueva < 1) {
      return { ok: false, mensaje: "La cantidad minima es 1." };
    }

    if (nueva > producto.stock) {
      return { ok: false, mensaje: "Solo quedan " + producto.stock + " unidades." };
    }

    setLineas(lineas.map((linea) => (linea.codigo === codigo ? { ...linea, cantidad: nueva } : linea)));
    return { ok: true, mensaje: "" };
  }

  function eliminar(codigo) {
    setLineas(lineas.filter((linea) => linea.codigo !== codigo));
  }

  function vaciar() {
    setLineas([]);
    setCodigoCupon(null);
  }

  function aplicarCupon(codigoIngresado) {
    const codigo = String(codigoIngresado || "").trim().toUpperCase();

    if (codigo === "") {
      return { ok: false, mensaje: "Ingresa un codigo de descuento." };
    }

    if (detalle.length === 0) {
      return { ok: false, mensaje: "Agrega productos antes de aplicar un cupon." };
    }

    const encontrado = buscarCupon(codigo);

    if (!encontrado) {
      return { ok: false, mensaje: "El codigo " + codigo + " no existe." };
    }

    if (cupon && cupon.codigo === encontrado.codigo) {
      return { ok: false, mensaje: "Ese cupon ya esta aplicado." };
    }

    if (encontrado.minimo && subtotal < encontrado.minimo) {
      return {
        ok: false,
        mensaje: "El cupon " + encontrado.codigo + " requiere una compra minima de " + formatearPrecio(encontrado.minimo) + "."
      };
    }

    setCodigoCupon(encontrado.codigo);
    return { ok: true, mensaje: "Cupon aplicado: " + encontrado.descripcion + "." };
  }

  function quitarCupon() {
    setCodigoCupon(null);
  }

  const valor = {
    detalle,
    cantidadTotal,
    subtotal,
    descuento,
    total,
    cupon,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    aplicarCupon,
    quitarCupon
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  return useContext(CarritoContext);
}

/* Lo que hace el boton Anadir en todas las grillas: agrega y avisa el
   resultado. Se escribe una vez aca en vez de repetirlo en cada pagina. */
export function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const { notificar } = useNotificacion();

  return function alAgregar(codigo, cantidad = 1) {
    const resultado = agregar(codigo, cantidad);
    notificar(resultado.mensaje, resultado.ok ? "exito" : "error");
  };
}
