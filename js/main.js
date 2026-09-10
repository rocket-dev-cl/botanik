/**
 * Botanik — Comportamiento comun a todas las vistas.
 *
 * El header, el nav y el footer estan escritos literalmente en cada HTML.
 * Aqui vive solo el comportamiento compartido, para no duplicarlo.
 *
 * Requiere bootstrap.bundle.min.js: sin el bundle los dropdowns y los tooltips
 * no funcionan y no se produce ningun error visible.
 */

const CLAVES = {
  carrito: "botanik_carrito",
  cupon: "botanik_cupon",
  sesion: "botanik_sesion",
  productos: "botanik_productos",
  usuarios: "botanik_usuarios",
  ordenes: "botanik_ordenes"
};

const Almacen = {
  leer: function (clave, respaldo) {
    try {
      const crudo = localStorage.getItem(clave);
      return crudo === null ? respaldo : JSON.parse(crudo);
    } catch (error) {
      return respaldo;
    }
  },

  escribir: function (clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      return false;
    }
  },

  borrar: function (clave) {
    try {
      localStorage.removeItem(clave);
    } catch (error) {
      return;
    }
  }
};

const Sesion = {
  obtener: function () {
    const sesion = Almacen.leer(CLAVES.sesion, null);

    if (!sesion || typeof sesion !== "object" || !sesion.correo) {
      return null;
    }

    return sesion;
  },

  iniciar: function (usuario) {
    Almacen.escribir(CLAVES.sesion, {
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      tipo: usuario.tipo
    });
  },

  cerrar: function () {
    Almacen.borrar(CLAVES.sesion);
  },

  esAdministrador: function () {
    const sesion = Sesion.obtener();
    return sesion !== null && sesion.tipo === "administrador";
  },

  puedeEntrarAdmin: function () {
    const sesion = Sesion.obtener();
    return sesion !== null && (sesion.tipo === "administrador" || sesion.tipo === "vendedor");
  }
};

/* El administrador guarda sus cambios en localStorage. Mientras no exista esa
   copia se usa el arreglo del archivo de datos, que es el estado de fabrica. */
function productosVigentes() {
  const guardados = Almacen.leer(CLAVES.productos, null);

  if (Array.isArray(guardados)) {
    return guardados;
  }

  return typeof PRODUCTOS === "undefined" ? [] : PRODUCTOS;
}

function usuariosVigentes() {
  const guardados = Almacen.leer(CLAVES.usuarios, null);

  if (Array.isArray(guardados)) {
    return guardados;
  }

  return typeof USUARIOS === "undefined" ? [] : USUARIOS;
}

function ordenesVigentes() {
  const guardadas = Almacen.leer(CLAVES.ordenes, null);

  if (Array.isArray(guardadas)) {
    return guardadas;
  }

  return typeof ORDENES === "undefined" ? [] : ORDENES;
}

function buscarProducto(codigo) {
  return productosVigentes().find(function (producto) {
    return producto.codigo === codigo;
  }) || null;
}

function rutaActual() {
  const partes = window.location.pathname.split("/");
  const archivo = partes[partes.length - 1];
  return archivo === "" ? "index.html" : archivo;
}

function marcarEnlaceActivo() {
  const actual = rutaActual();

  document.querySelectorAll("[data-bt-pagina]").forEach(function (enlace) {
    if (enlace.dataset.btPagina === actual) {
      enlace.classList.add("activo");
      enlace.setAttribute("aria-current", "page");
    }
  });
}

function totalItemsCarrito() {
  const lineas = Almacen.leer(CLAVES.carrito, []);

  if (!Array.isArray(lineas)) {
    return 0;
  }

  return lineas.reduce(function (suma, linea) {
    const cantidad = Number(linea && linea.cantidad);
    return suma + (Number.isFinite(cantidad) ? cantidad : 0);
  }, 0);
}

function actualizarContadorCarrito() {
  const total = totalItemsCarrito();

  document.querySelectorAll("[data-bt-conteo-carrito]").forEach(function (nodo) {
    nodo.textContent = total;
    nodo.setAttribute("aria-label", total === 1 ? "1 producto en el carrito" : total + " productos en el carrito");
  });
}

function aplicarSesionAlMenu() {
  const sesion = Sesion.obtener();
  const invitado = document.querySelectorAll("[data-bt-sesion-invitado]");
  const activa = document.querySelectorAll("[data-bt-sesion-activa]");

  invitado.forEach(function (nodo) {
    nodo.classList.toggle("d-none", sesion !== null);
  });

  activa.forEach(function (nodo) {
    nodo.classList.toggle("d-none", sesion === null);
  });

  if (sesion === null) {
    return;
  }

  document.querySelectorAll("[data-bt-nombre-usuario]").forEach(function (nodo) {
    nodo.textContent = sesion.nombre;
  });

  document.querySelectorAll("[data-bt-enlace-admin]").forEach(function (nodo) {
    nodo.classList.toggle("d-none", !Sesion.puedeEntrarAdmin());
  });
}

function conectarCierreDeSesion() {
  document.querySelectorAll("[data-bt-cerrar-sesion]").forEach(function (boton) {
    boton.addEventListener("click", function (evento) {
      evento.preventDefault();
      Sesion.cerrar();
      window.location.href = boton.dataset.btDestino || "index.html";
    });
  });
}

function iniciarTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (elemento) {
    new bootstrap.Tooltip(elemento);
  });
}

function anioEnPie() {
  document.querySelectorAll("[data-bt-anio]").forEach(function (nodo) {
    nodo.textContent = new Date().getFullYear();
  });
}

/* El formulario del boletin vive en el pie de las 11 vistas de la tienda (R.12),
   asi que se conecta aca y no en el script de una vista concreta. */
function conectarBoletin() {
  const formulario = document.querySelector("#formBoletin");

  if (!formulario) {
    return;
  }

  const campo = formulario.querySelector("#correoBoletin");

  formulario.setAttribute("novalidate", "novalidate");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resultado = Validaciones.correo(campo.value);

    if (!resultado.valido) {
      UI.mostrarError(campo, resultado.mensaje);
      return;
    }

    UI.limpiarError(campo, true);
    campo.value = "";
    UI.notificar("Listo. Te escribiremos con consejos de cuidado.", "exito");
  });
}

function mostrarAvisosDeUrl() {
  const parametros = new URLSearchParams(window.location.search);

  if (parametros.get("acceso") === "denegado") {
    UI.notificar("Tu perfil no tiene acceso al modulo de administracion.", "error");
  }

  if (parametros.get("sesion") === "cerrada") {
    UI.notificar("Cerraste sesion.", "aviso");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  marcarEnlaceActivo();
  actualizarContadorCarrito();
  aplicarSesionAlMenu();
  conectarCierreDeSesion();
  conectarBoletin();
  iniciarTooltips();
  anioEnPie();
  mostrarAvisosDeUrl();
});

/* El contador se refresca tambien cuando el carrito cambia en otra pestaña. */
window.addEventListener("storage", function (evento) {
  if (evento.key === CLAVES.carrito) {
    actualizarContadorCarrito();
  }
});
