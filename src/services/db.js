/**
 * Botanik — Fuente de datos simulada.
 *
 * Hace el papel de una base de datos: cada coleccion parte de su arreglo en
 * src/data/ y, desde la primera escritura, vive en localStorage. Leer, crear,
 * actualizar y eliminar pasa siempre por aca, nunca por el arreglo directo, asi
 * que un cambio hecho en el administrador se ve de inmediato en la tienda.
 *
 * Se exporta como un objeto (db.getProductos(), db.crearProducto()...) y no
 * como funciones sueltas a proposito: en las pruebas, spyOn(db, "getProductos")
 * reemplaza el metodo del objeto. Una funcion exportada suelta no se puede
 * espiar, porque el empaquetador la deja de solo lectura.
 */

import { PRODUCTOS } from "../data/productos.js";
import { CATEGORIAS, ETIQUETAS } from "../data/categorias.js";
import { USUARIOS } from "../data/usuarios.js";
import { ORDENES, ESTADOS_ORDEN } from "../data/ordenes.js";
import { REGIONES } from "../data/regiones.js";

export const CLAVES = {
  carrito: "botanik_carrito",
  cupon: "botanik_cupon",
  sesion: "botanik_sesion",
  productos: "botanik_productos",
  categorias: "botanik_categorias",
  usuarios: "botanik_usuarios",
  ordenes: "botanik_ordenes"
};

export const Almacen = {
  leer(clave, respaldo) {
    try {
      const crudo = localStorage.getItem(clave);
      return crudo === null ? respaldo : JSON.parse(crudo);
    } catch (error) {
      return respaldo;
    }
  },

  escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      return false;
    }
  },

  borrar(clave) {
    try {
      localStorage.removeItem(clave);
    } catch (error) {
      // Sin almacenamiento disponible no hay nada que borrar.
    }
  }
};

/* Mientras nadie haya escrito, la coleccion es el arreglo de fabrica. Se
   devuelve una copia para que ningun componente modifique el original. */
function leerColeccion(clave, inicial) {
  const guardada = Almacen.leer(clave, null);
  return Array.isArray(guardada) ? guardada : inicial.slice();
}

function resultado(ok, mensaje, dato) {
  return { ok, mensaje, dato: dato || null };
}

function hoyIso() {
  const hoy = new Date();
  return hoy.getFullYear() + "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
    String(hoy.getDate()).padStart(2, "0");
}

export const db = {
  // ------------------------------------------------------------ Productos
  getProductos() {
    return leerColeccion(CLAVES.productos, PRODUCTOS);
  },

  getProducto(codigo) {
    return db.getProductos().find((producto) => producto.codigo === codigo) || null;
  },

  crearProducto(producto) {
    const productos = db.getProductos();

    if (productos.some((item) => item.codigo === producto.codigo)) {
      return resultado(false, "Ya existe un producto con el codigo " + producto.codigo + ".");
    }

    productos.push(producto);
    Almacen.escribir(CLAVES.productos, productos);
    return resultado(true, "Producto creado.", producto);
  },

  actualizarProducto(codigo, cambios) {
    const productos = db.getProductos();
    const indice = productos.findIndex((item) => item.codigo === codigo);

    if (indice === -1) {
      return resultado(false, "El producto " + codigo + " no existe.");
    }

    productos[indice] = { ...productos[indice], ...cambios, codigo };
    Almacen.escribir(CLAVES.productos, productos);
    return resultado(true, "Producto actualizado.", productos[indice]);
  },

  eliminarProducto(codigo) {
    const productos = db.getProductos();
    const restantes = productos.filter((item) => item.codigo !== codigo);

    if (restantes.length === productos.length) {
      return resultado(false, "El producto " + codigo + " no existe.");
    }

    Almacen.escribir(CLAVES.productos, restantes);
    return resultado(true, "Producto eliminado.");
  },

  /* Una venta confirmada descuenta lo vendido. Nunca deja el stock negativo. */
  descontarStock(lineas) {
    const productos = db.getProductos().map((producto) => {
      const linea = lineas.find((item) => item.codigo === producto.codigo);
      return linea ? { ...producto, stock: Math.max(0, producto.stock - linea.cantidad) } : producto;
    });

    Almacen.escribir(CLAVES.productos, productos);
  },

  // ----------------------------------------------------------- Categorias
  getCategorias() {
    return leerColeccion(CLAVES.categorias, CATEGORIAS);
  },

  getCategoria(id) {
    return db.getCategorias().find((categoria) => categoria.id === id) || null;
  },

  crearCategoria(categoria) {
    const categorias = db.getCategorias();

    if (categorias.some((item) => item.id === categoria.id)) {
      return resultado(false, "Ya existe una categoria con el identificador " + categoria.id + ".");
    }

    categorias.push({ subcategorias: [], ...categoria });
    Almacen.escribir(CLAVES.categorias, categorias);
    return resultado(true, "Categoria creada.", categoria);
  },

  actualizarCategoria(id, cambios) {
    const categorias = db.getCategorias();
    const indice = categorias.findIndex((item) => item.id === id);

    if (indice === -1) {
      return resultado(false, "La categoria no existe.");
    }

    categorias[indice] = { ...categorias[indice], ...cambios, id };
    Almacen.escribir(CLAVES.categorias, categorias);
    return resultado(true, "Categoria actualizada.", categorias[indice]);
  },

  /* Una categoria con productos no se elimina: dejaria productos huerfanos. */
  eliminarCategoria(id) {
    if (db.getProductos().some((producto) => producto.categoria === id)) {
      return resultado(false, "No se puede eliminar: hay productos en esa categoria.");
    }

    Almacen.escribir(CLAVES.categorias, db.getCategorias().filter((item) => item.id !== id));
    return resultado(true, "Categoria eliminada.");
  },

  getEtiquetas() {
    return ETIQUETAS;
  },

  // ------------------------------------------------------------- Usuarios
  getUsuarios() {
    return leerColeccion(CLAVES.usuarios, USUARIOS);
  },

  getUsuario(run) {
    return db.getUsuarios().find((usuario) => usuario.run === run) || null;
  },

  buscarUsuarioPorCorreo(correo) {
    const buscado = String(correo).trim().toLowerCase();
    return db.getUsuarios().find((usuario) => usuario.correo.toLowerCase() === buscado) || null;
  },

  crearUsuario(usuario) {
    const usuarios = db.getUsuarios();

    if (usuarios.some((item) => item.run === usuario.run)) {
      return resultado(false, "Ya existe un usuario con ese RUN.");
    }

    if (db.buscarUsuarioPorCorreo(usuario.correo)) {
      return resultado(false, "Ya existe un usuario con ese correo.");
    }

    usuarios.push(usuario);
    Almacen.escribir(CLAVES.usuarios, usuarios);
    return resultado(true, "Usuario creado.", usuario);
  },

  actualizarUsuario(run, cambios) {
    const usuarios = db.getUsuarios();
    const indice = usuarios.findIndex((item) => item.run === run);

    if (indice === -1) {
      return resultado(false, "El usuario no existe.");
    }

    const otroConCorreo = usuarios.find((item) =>
      item.run !== run && cambios.correo && item.correo.toLowerCase() === cambios.correo.toLowerCase());

    if (otroConCorreo) {
      return resultado(false, "Ya existe otro usuario con ese correo.");
    }

    usuarios[indice] = { ...usuarios[indice], ...cambios, run };
    Almacen.escribir(CLAVES.usuarios, usuarios);
    return resultado(true, "Usuario actualizado.", usuarios[indice]);
  },

  eliminarUsuario(run) {
    const usuarios = db.getUsuarios();
    const restantes = usuarios.filter((item) => item.run !== run);

    if (restantes.length === usuarios.length) {
      return resultado(false, "El usuario no existe.");
    }

    Almacen.escribir(CLAVES.usuarios, restantes);
    return resultado(true, "Usuario eliminado.");
  },

  // -------------------------------------------------------------- Ordenes
  getOrdenes() {
    return leerColeccion(CLAVES.ordenes, ORDENES);
  },

  getOrden(numero) {
    return db.getOrdenes().find((orden) => orden.numero === numero) || null;
  },

  getOrdenesDeCliente(run) {
    return db.getOrdenes().filter((orden) => orden.clienteRun === run);
  },

  getEstadosOrden() {
    return ESTADOS_ORDEN;
  },

  /* Numero correlativo a partir del mayor existente: ORD-1012 -> ORD-1013. */
  siguienteNumeroOrden() {
    const mayor = db.getOrdenes().reduce((maximo, orden) => {
      const numero = Number(String(orden.numero).replace(/[^0-9]/g, ""));
      return Number.isFinite(numero) && numero > maximo ? numero : maximo;
    }, 1000);

    return "ORD-" + (mayor + 1);
  },

  /* La orden congela nombre y precio de cada linea: es un registro historico y
     no puede cambiar porque despues alguien edite el catalogo. */
  crearOrden(datos) {
    const ordenes = db.getOrdenes();
    const orden = {
      numero: db.siguienteNumeroOrden(),
      fecha: hoyIso(),
      estado: "pendiente",
      ...datos
    };

    ordenes.push(orden);
    Almacen.escribir(CLAVES.ordenes, ordenes);
    return resultado(true, "Orden registrada.", orden);
  },

  actualizarOrden(numero, cambios) {
    const ordenes = db.getOrdenes();
    const indice = ordenes.findIndex((item) => item.numero === numero);

    if (indice === -1) {
      return resultado(false, "La orden no existe.");
    }

    ordenes[indice] = { ...ordenes[indice], ...cambios, numero };
    Almacen.escribir(CLAVES.ordenes, ordenes);
    return resultado(true, "Orden actualizada.", ordenes[indice]);
  },

  // ------------------------------------------------------------- Regiones
  getRegiones() {
    return REGIONES;
  },

  getComunas(idRegion) {
    const region = REGIONES.find((item) => item.id === idRegion);
    return region ? region.comunas : [];
  },

  // -------------------------------------------------------------- General
  /* Borra lo que escribio el administrador y vuelve a los datos de fabrica. */
  restaurar() {
    [CLAVES.productos, CLAVES.categorias, CLAVES.usuarios, CLAVES.ordenes]
      .forEach((clave) => Almacen.borrar(clave));
  }
};
