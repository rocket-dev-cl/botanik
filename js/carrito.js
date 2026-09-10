/**
 * Botanik — Carrito de compras.
 * Se carga en: productos.html, detalle-producto.html, carrito.html
 *
 * El carrito guarda solo codigo y cantidad. El precio, el nombre y la imagen se
 * resuelven contra el catalogo en cada lectura, para que un cambio de precio en
 * el administrador no quede congelado en localStorage.
 */

const CUPONES = [
  { codigo: "BOTANIK10", descripcion: "10% de descuento", tipo: "porcentaje", valor: 10 },
  { codigo: "VERDE5000", descripcion: "$5.000 de descuento", tipo: "monto", valor: 5000, minimo: 20000 },
  { codigo: "BIENVENIDA", descripcion: "15% de descuento", tipo: "porcentaje", valor: 15 }
];

const Carrito = (function () {
  function lineas() {
    const guardado = Almacen.leer(CLAVES.carrito, []);

    if (!Array.isArray(guardado)) {
      return [];
    }

    return guardado.filter(function (linea) {
      return linea && typeof linea.codigo === "string" && Number(linea.cantidad) > 0;
    });
  }

  function guardar(nuevasLineas) {
    Almacen.escribir(CLAVES.carrito, nuevasLineas);
    actualizarContadorCarrito();
  }

  /* Solo se listan las lineas cuyo producto sigue existiendo en el catalogo:
     si el administrador elimina un producto, la linea deja de aparecer. */
  function detalle() {
    return lineas().reduce(function (acumulado, linea) {
      const producto = buscarProducto(linea.codigo);

      if (producto) {
        acumulado.push({
          producto: producto,
          cantidad: Number(linea.cantidad),
          subtotal: producto.precio * Number(linea.cantidad)
        });
      }

      return acumulado;
    }, []);
  }

  function agregar(codigo, cantidad) {
    const producto = buscarProducto(codigo);

    if (!producto) {
      return { ok: false, mensaje: "Ese producto ya no esta disponible." };
    }

    if (producto.stock === 0) {
      return { ok: false, mensaje: "Ese producto esta agotado." };
    }

    const cuantos = Math.max(1, Number(cantidad) || 1);
    const actuales = lineas();
    const existente = actuales.find(function (linea) {
      return linea.codigo === codigo;
    });

    const yaEnCarrito = existente ? existente.cantidad : 0;

    if (yaEnCarrito + cuantos > producto.stock) {
      return {
        ok: false,
        mensaje: "Solo quedan " + producto.stock + " unidades de " + producto.nombre + "."
      };
    }

    if (existente) {
      existente.cantidad = yaEnCarrito + cuantos;
    } else {
      actuales.push({ codigo: codigo, cantidad: cuantos });
    }

    guardar(actuales);

    return { ok: true, mensaje: producto.nombre + " se agrego al carrito." };
  }

  function cambiarCantidad(codigo, cantidad) {
    const producto = buscarProducto(codigo);
    const actuales = lineas();
    const linea = actuales.find(function (item) {
      return item.codigo === codigo;
    });

    if (!linea || !producto) {
      return { ok: false, mensaje: "Esa linea ya no existe." };
    }

    const nueva = Number(cantidad);

    if (!Number.isInteger(nueva) || nueva < 1) {
      return { ok: false, mensaje: "La cantidad minima es 1." };
    }

    if (nueva > producto.stock) {
      return { ok: false, mensaje: "Solo quedan " + producto.stock + " unidades." };
    }

    linea.cantidad = nueva;
    guardar(actuales);

    return { ok: true, mensaje: "" };
  }

  function eliminar(codigo) {
    guardar(lineas().filter(function (linea) {
      return linea.codigo !== codigo;
    }));
  }

  function vaciar() {
    Almacen.borrar(CLAVES.carrito);
    Almacen.borrar(CLAVES.cupon);
    actualizarContadorCarrito();
  }

  function subtotal() {
    return detalle().reduce(function (suma, linea) {
      return suma + linea.subtotal;
    }, 0);
  }

  function cuponAplicado() {
    const guardado = Almacen.leer(CLAVES.cupon, null);

    if (!guardado || typeof guardado !== "string") {
      return null;
    }

    return CUPONES.find(function (cupon) {
      return cupon.codigo === guardado;
    }) || null;
  }

  function descuento() {
    const cupon = cuponAplicado();

    if (!cupon) {
      return 0;
    }

    const base = subtotal();

    if (cupon.minimo && base < cupon.minimo) {
      return 0;
    }

    if (cupon.tipo === "porcentaje") {
      return Math.round(base * (cupon.valor / 100));
    }

    return Math.min(cupon.valor, base);
  }

  function total() {
    return Math.max(0, subtotal() - descuento());
  }

  function aplicarCupon(codigoIngresado) {
    const codigo = String(codigoIngresado || "").trim().toUpperCase();

    if (codigo === "") {
      return { ok: false, mensaje: "Ingresa un codigo de descuento." };
    }

    if (detalle().length === 0) {
      return { ok: false, mensaje: "Agrega productos antes de aplicar un cupon." };
    }

    const cupon = CUPONES.find(function (item) {
      return item.codigo === codigo;
    });

    if (!cupon) {
      return { ok: false, mensaje: "El codigo " + codigo + " no existe." };
    }

    const actual = cuponAplicado();

    if (actual && actual.codigo === cupon.codigo) {
      return { ok: false, mensaje: "Ese cupon ya esta aplicado." };
    }

    if (cupon.minimo && subtotal() < cupon.minimo) {
      return {
        ok: false,
        mensaje: "El cupon " + cupon.codigo + " requiere una compra minima de " + UI.formatearPrecio(cupon.minimo) + "."
      };
    }

    Almacen.escribir(CLAVES.cupon, cupon.codigo);

    return { ok: true, mensaje: "Cupon aplicado: " + cupon.descripcion + "." };
  }

  function quitarCupon() {
    Almacen.borrar(CLAVES.cupon);
  }

  function siguienteNumero(existentes) {
    const ultimo = existentes.reduce(function (mayor, orden) {
      const numero = Number(String(orden.numero).replace(/[^0-9]/g, ""));
      return Number.isFinite(numero) && numero > mayor ? numero : mayor;
    }, 1000);

    return "ORD-" + (ultimo + 1);
  }

  /* La orden congela nombre y precio de cada linea. Es un registro historico:
     si despues cambia el catalogo, la venta ya ocurrida no puede cambiar. */
  function registrarOrden(sesion) {
    const lineas = detalle();
    const existentes = ordenesVigentes().slice();
    const cupon = cuponAplicado();
    const hoy = new Date();

    /* La sesion solo guarda la identidad; la direccion de despacho se lee del
       registro del usuario, que es donde puede haber cambiado. */
    const cliente = usuariosVigentes().find(function (usuario) {
      return usuario.run === sesion.run;
    }) || sesion;

    const orden = {
      numero: siguienteNumero(existentes),
      fecha: hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0"),
      clienteRun: cliente.run,
      clienteNombre: cliente.nombre + " " + cliente.apellidos,
      clienteCorreo: cliente.correo,
      region: cliente.region || "",
      comuna: cliente.comuna || "",
      direccion: cliente.direccion || "",
      estado: "pendiente",
      cupon: cupon ? cupon.codigo : null,
      subtotal: subtotal(),
      descuento: descuento(),
      total: total(),
      lineas: lineas.map(function (linea) {
        return {
          codigo: linea.producto.codigo,
          nombre: linea.producto.nombre,
          precio: linea.producto.precio,
          cantidad: linea.cantidad
        };
      })
    };

    existentes.push(orden);
    Almacen.escribir(CLAVES.ordenes, existentes);

    return orden;
  }

  return {
    registrarOrden: registrarOrden,
    detalle: detalle,
    agregar: agregar,
    cambiarCantidad: cambiarCantidad,
    eliminar: eliminar,
    vaciar: vaciar,
    subtotal: subtotal,
    descuento: descuento,
    total: total,
    cuponAplicado: cuponAplicado,
    aplicarCupon: aplicarCupon,
    quitarCupon: quitarCupon
  };
})();

/* Los botones "Anadir" los genera catalogo.js, asi que el listener se delega en
   document y funciona igual en la grilla, en el detalle y en relacionados. */
document.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-bt-agregar]");

  if (!boton) {
    return;
  }

  evento.preventDefault();

  const campoCantidad = document.querySelector("[data-bt-cantidad-detalle]");
  const cantidad = boton.dataset.btConCantidad && campoCantidad ? campoCantidad.value : 1;
  const resultado = Carrito.agregar(boton.dataset.btAgregar, cantidad);

  UI.notificar(resultado.mensaje, resultado.ok ? "exito" : "error");
});

function pintarCarrito() {
  const contenedor = document.querySelector("[data-bt-lineas-carrito]");

  if (!contenedor) {
    return;
  }

  const lineas = Carrito.detalle();
  const panelVacio = document.querySelector("[data-bt-carrito-vacio]");
  const panelConDatos = document.querySelector("[data-bt-carrito-con-datos]");

  panelVacio.classList.toggle("d-none", lineas.length > 0);
  panelConDatos.classList.toggle("d-none", lineas.length === 0);

  if (lineas.length === 0) {
    contenedor.innerHTML = "";
    return;
  }

  contenedor.innerHTML = lineas.map(function (linea) {
    const producto = linea.producto;
    const imagen = producto.imagen || "img/ui/sin-imagen.svg";

    return '' +
      '<article class="bt-linea">' +
        '<img class="bt-linea-img" src="' + imagen + '" alt="' + producto.nombre + '">' +
        '<div>' +
          '<h3 class="h6 mb-1"><a href="detalle-producto.html?codigo=' + producto.codigo + '">' + producto.nombre + '</a></h3>' +
          '<p class="text-body-secondary small mb-1">' + producto.codigo + '</p>' +
          '<p class="text-body-secondary small mb-0">' + UI.formatearPrecio(producto.precio) + ' c/u</p>' +
        '</div>' +
        '<div class="bt-linea-cantidad input-group input-group-sm bt-cantidad">' +
          '<button class="btn btn-outline-secondary" type="button" data-bt-restar="' + producto.codigo + '" aria-label="Quitar una unidad">&minus;</button>' +
          '<input class="form-control" type="text" value="' + linea.cantidad + '" readonly aria-label="Cantidad de ' + producto.nombre + '">' +
          '<button class="btn btn-outline-secondary" type="button" data-bt-sumar="' + producto.codigo + '" aria-label="Agregar una unidad">+</button>' +
        '</div>' +
        '<div class="bt-linea-total d-flex align-items-center gap-3">' +
          '<span class="bt-linea-subtotal">' + UI.formatearPrecio(linea.subtotal) + '</span>' +
          '<button class="btn btn-sm btn-outline-secondary" type="button" data-bt-eliminar-linea="' + producto.codigo + '" aria-label="Eliminar ' + producto.nombre + ' del carrito">Eliminar</button>' +
        '</div>' +
      '</article>';
  }).join("");

  pintarResumen();
}

function pintarResumen() {
  const cupon = Carrito.cuponAplicado();
  const descuento = Carrito.descuento();
  const items = Carrito.detalle().reduce(function (suma, linea) {
    return suma + linea.cantidad;
  }, 0);

  const nodoItems = document.querySelector("[data-bt-resumen-items]");
  const nodoSubtotal = document.querySelector("[data-bt-resumen-subtotal]");
  const nodoDescuento = document.querySelector("[data-bt-resumen-descuento]");
  const filaDescuento = document.querySelector("[data-bt-fila-descuento]");
  const nodoTotal = document.querySelector("[data-bt-resumen-total]");
  const avisoCupon = document.querySelector("[data-bt-cupon-aplicado]");

  if (nodoItems) {
    nodoItems.textContent = items === 1 ? "1 item" : items + " items";
  }

  if (nodoSubtotal) {
    nodoSubtotal.textContent = UI.formatearPrecio(Carrito.subtotal());
  }

  if (filaDescuento) {
    filaDescuento.classList.toggle("d-none", descuento === 0);
  }

  if (nodoDescuento) {
    nodoDescuento.textContent = "−" + UI.formatearPrecio(descuento);
  }

  if (nodoTotal) {
    nodoTotal.textContent = UI.formatearPrecio(Carrito.total());
  }

  if (avisoCupon) {
    avisoCupon.classList.toggle("d-none", cupon === null);

    if (cupon) {
      avisoCupon.querySelector("[data-bt-cupon-texto]").textContent =
        "Cupon " + cupon.codigo + ": " + cupon.descripcion;
    }
  }
}

function conectarCarrito() {
  const contenedor = document.querySelector("[data-bt-lineas-carrito]");

  if (!contenedor) {
    return;
  }

  contenedor.addEventListener("click", function (evento) {
    const sumar = evento.target.closest("[data-bt-sumar]");
    const restar = evento.target.closest("[data-bt-restar]");
    const eliminar = evento.target.closest("[data-bt-eliminar-linea]");

    if (sumar || restar) {
      const codigo = sumar ? sumar.dataset.btSumar : restar.dataset.btRestar;
      const actual = Carrito.detalle().find(function (linea) {
        return linea.producto.codigo === codigo;
      });

      if (!actual) {
        return;
      }

      const resultado = Carrito.cambiarCantidad(codigo, actual.cantidad + (sumar ? 1 : -1));

      if (!resultado.ok) {
        UI.notificar(resultado.mensaje, "aviso");
        return;
      }

      pintarCarrito();
      return;
    }

    if (eliminar) {
      const codigo = eliminar.dataset.btEliminarLinea;
      const producto = buscarProducto(codigo);

      UI.confirmar(
        "Se quitara " + (producto ? producto.nombre : "este producto") + " del carrito.",
        { titulo: "Eliminar del carrito", textoAceptar: "Eliminar" }
      ).then(function (confirmado) {
        if (!confirmado) {
          return;
        }

        Carrito.eliminar(codigo);
        pintarCarrito();
        UI.notificar("Producto eliminado del carrito.", "exito");
      });
    }
  });

  const formCupon = document.querySelector("[data-bt-form-cupon]");

  if (formCupon) {
    formCupon.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const campo = formCupon.querySelector("#cupon");
      const resultado = Carrito.aplicarCupon(campo.value);

      if (resultado.ok) {
        UI.limpiarError(campo, true);
        campo.value = "";
        pintarResumen();
        UI.notificar(resultado.mensaje, "exito");
      } else {
        UI.mostrarError(campo, resultado.mensaje);
      }
    });
  }

  const quitarCupon = document.querySelector("[data-bt-quitar-cupon]");

  if (quitarCupon) {
    quitarCupon.addEventListener("click", function () {
      Carrito.quitarCupon();
      pintarResumen();
      UI.notificar("Cupon retirado.", "aviso");
    });
  }

  const vaciar = document.querySelector("[data-bt-vaciar-carrito]");

  if (vaciar) {
    vaciar.addEventListener("click", function () {
      UI.confirmar("Se quitaran todos los productos del carrito.", {
        titulo: "Vaciar carrito",
        textoAceptar: "Vaciar"
      }).then(function (confirmado) {
        if (!confirmado) {
          return;
        }

        Carrito.vaciar();
        pintarCarrito();
        UI.notificar("El carrito quedo vacio.", "exito");
      });
    });
  }

  const pagar = document.querySelector("[data-bt-pagar]");

  if (pagar) {
    pagar.addEventListener("click", function () {
      const sesion = Sesion.obtener();

      if (!sesion) {
        UI.notificar("Inicia sesion para completar la compra.", "aviso");
        window.setTimeout(function () {
          window.location.href = "login.html?destino=carrito";
        }, 1200);
        return;
      }

      UI.confirmar(
        "Esta entrega no incluye pasarela de pago. Se registrara la orden por " +
          UI.formatearPrecio(Carrito.total()) + " en el historial de ventas y se vaciara el carrito.",
        { titulo: "Confirmar compra", textoAceptar: "Confirmar", claseAceptar: "btn-primary" }
      ).then(function (confirmado) {
        if (!confirmado) {
          return;
        }

        const orden = Carrito.registrarOrden(sesion);

        Carrito.vaciar();
        pintarCarrito();
        UI.notificar("Orden " + orden.numero + " registrada. Gracias por preferir Botanik.", "exito");
      });
    });
  }

  pintarCarrito();
}

document.addEventListener("DOMContentLoaded", conectarCarrito);
