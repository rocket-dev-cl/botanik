/**
 * Botanik — Reglas de validacion de formularios.
 *
 * Cada regla devuelve { valido, mensaje }. Ninguna toca el DOM: quien pinta el
 * resultado es UI.mostrarError / UI.limpiarError, para que la misma regla sirva
 * en la tienda y en el mantenedor.
 */

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

const Validaciones = (function () {
  const ok = { valido: true, mensaje: "" };

  function error(mensaje) {
    return { valido: false, mensaje: mensaje };
  }

  function vacio(valor) {
    return valor === null || valor === undefined || String(valor).trim() === "";
  }

  function requerido(valor, etiqueta) {
    if (vacio(valor)) {
      return error("Ingresa " + etiqueta + ".");
    }
    return ok;
  }

  function largoMaximo(valor, maximo, etiqueta) {
    if (String(valor).trim().length > maximo) {
      return error(etiqueta + " no puede superar los " + maximo + " caracteres.");
    }
    return ok;
  }

  /* Modulo 11 sobre el cuerpo del RUN. El DV puede ser digito o K. */
  function digitoVerificador(cuerpo) {
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);

    if (resto === 11) {
      return "0";
    }
    if (resto === 10) {
      return "K";
    }
    return String(resto);
  }

  function run(valor) {
    const limpio = String(valor).trim().toUpperCase();

    if (vacio(limpio)) {
      return error("Ingresa tu RUN.");
    }

    if (limpio.indexOf(".") !== -1 || limpio.indexOf("-") !== -1) {
      return error("Escribe el RUN sin puntos ni guion. Ejemplo: 19011022K.");
    }

    if (limpio.length < 7 || limpio.length > 9) {
      return error("El RUN debe tener entre 7 y 9 caracteres.");
    }

    if (!/^[0-9]+[0-9K]$/.test(limpio)) {
      return error("El RUN solo admite numeros y una K final como digito verificador.");
    }

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    if (digitoVerificador(cuerpo) !== dv) {
      return error("El RUN no es valido: el digito verificador no corresponde.");
    }

    return ok;
  }

  function correo(valor) {
    const limpio = String(valor).trim().toLowerCase();

    if (vacio(limpio)) {
      return error("Ingresa tu correo electronico.");
    }

    if (limpio.length > 100) {
      return error("El correo no puede superar los 100 caracteres.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
      return error("El formato del correo no es valido.");
    }

    const permitido = DOMINIOS_PERMITIDOS.some(function (dominio) {
      return limpio.endsWith(dominio);
    });

    if (!permitido) {
      return error("Ese dominio no esta permitido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    }

    return ok;
  }

  function contrasena(valor) {
    const texto = String(valor);

    if (vacio(texto)) {
      return error("Ingresa tu contrasena.");
    }

    if (texto.length < 4 || texto.length > 10) {
      return error("La contrasena debe tener entre 4 y 10 caracteres.");
    }

    return ok;
  }

  function confirmacion(valor, original) {
    if (vacio(valor)) {
      return error("Repite la contrasena.");
    }

    if (String(valor) !== String(original)) {
      return error("Las dos contrasenas no coinciden.");
    }

    return ok;
  }

  function nombre(valor) {
    const requerida = requerido(valor, "tu nombre");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 50, "El nombre");
  }

  function apellidos(valor) {
    const requerida = requerido(valor, "tus apellidos");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 100, "Los apellidos");
  }

  function nombreContacto(valor) {
    const requerida = requerido(valor, "tu nombre completo");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 100, "El nombre");
  }

  function comentario(valor) {
    const requerida = requerido(valor, "un comentario");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 500, "El comentario");
  }

  function direccion(valor) {
    const requerida = requerido(valor, "tu direccion");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 300, "La direccion");
  }

  function seleccion(valor, etiqueta) {
    if (vacio(valor)) {
      return error("Selecciona " + etiqueta + ".");
    }
    return ok;
  }

  function fechaNacimiento(valor) {
    if (vacio(valor)) {
      return ok;
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
      return error("La fecha no es valida.");
    }

    if (fecha > new Date()) {
      return error("La fecha de nacimiento no puede estar en el futuro.");
    }

    return ok;
  }

  function telefono(valor) {
    if (vacio(valor)) {
      return ok;
    }

    if (!/^\+?[0-9\s]{8,15}$/.test(String(valor).trim())) {
      return error("El telefono solo admite numeros, entre 8 y 15 digitos.");
    }

    return ok;
  }

  function codigoProducto(valor) {
    const limpio = String(valor).trim();

    if (vacio(limpio)) {
      return error("Ingresa el codigo del producto.");
    }

    if (limpio.length < 3) {
      return error("El codigo debe tener al menos 3 caracteres.");
    }

    return ok;
  }

  function nombreProducto(valor) {
    const requerida = requerido(valor, "el nombre del producto");
    if (!requerida.valido) {
      return requerida;
    }
    return largoMaximo(valor, 100, "El nombre");
  }

  function descripcion(valor) {
    if (vacio(valor)) {
      return ok;
    }
    return largoMaximo(valor, 500, "La descripcion");
  }

  function precio(valor) {
    if (vacio(valor)) {
      return error("Ingresa el precio.");
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return error("El precio debe ser un numero.");
    }

    if (numero < 0) {
      return error("El precio no puede ser negativo. Usa 0 para un producto gratuito.");
    }

    return ok;
  }

  function entero(valor, etiqueta, opcional) {
    if (vacio(valor)) {
      return opcional ? ok : error("Ingresa " + etiqueta + ".");
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero)) {
      return error(etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1) + " debe ser un numero entero.");
    }

    if (numero < 0) {
      return error(etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1) + " no puede ser negativo.");
    }

    return ok;
  }

  function stock(valor) {
    return entero(valor, "el stock", false);
  }

  function stockCritico(valor) {
    return entero(valor, "el stock critico", true);
  }

  return {
    run: run,
    digitoVerificador: digitoVerificador,
    correo: correo,
    contrasena: contrasena,
    confirmacion: confirmacion,
    nombre: nombre,
    apellidos: apellidos,
    nombreContacto: nombreContacto,
    comentario: comentario,
    direccion: direccion,
    seleccion: seleccion,
    fechaNacimiento: fechaNacimiento,
    telefono: telefono,
    codigoProducto: codigoProducto,
    nombreProducto: nombreProducto,
    descripcion: descripcion,
    precio: precio,
    stock: stock,
    stockCritico: stockCritico
  };
})();

/**
 * Conecta un formulario con su mapa de reglas.
 *
 * reglas: { idDelCampo: function (valor, formulario) { return {valido, mensaje}; } }
 * alEnviar: se ejecuta solo si todas las reglas pasan.
 */
function conectarFormulario(formulario, reglas, alEnviar) {
  if (!formulario) {
    return;
  }

  function validarCampo(id) {
    const campo = formulario.querySelector("#" + id);

    if (!campo) {
      return true;
    }

    const resultado = reglas[id](campo.value, formulario);

    if (resultado.valido) {
      UI.limpiarError(campo, campo.value.trim() !== "");
    } else {
      UI.mostrarError(campo, resultado.mensaje);
    }

    return resultado.valido;
  }

  Object.keys(reglas).forEach(function (id) {
    const campo = formulario.querySelector("#" + id);

    if (!campo) {
      return;
    }

    campo.addEventListener("blur", function () {
      validarCampo(id);
    });

    /* Solo se revalida al escribir si el campo ya estaba marcado en rojo: de lo
       contrario el usuario ve el error antes de terminar de escribir. */
    campo.addEventListener("input", function () {
      if (campo.classList.contains("is-invalid")) {
        validarCampo(id);
      }
    });
  });

  formulario.setAttribute("novalidate", "novalidate");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const invalidos = Object.keys(reglas).filter(function (id) {
      return !validarCampo(id);
    });

    if (invalidos.length > 0) {
      const primero = formulario.querySelector("#" + invalidos[0]);

      if (primero) {
        primero.focus();
        primero.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      UI.notificar(
        invalidos.length === 1
          ? "Queda 1 campo por corregir."
          : "Quedan " + invalidos.length + " campos por corregir.",
        "error"
      );
      return;
    }

    alEnviar(formulario);
  });
}

/**
 * Encadena dos selects: el segundo queda deshabilitado hasta que el primero
 * tenga valor, y pierde la seleccion previa al cambiar el primero (R.19).
 */
function encadenarSelects(selectPadre, selectHijo, obtenerOpciones, textoVacio) {
  if (!selectPadre || !selectHijo) {
    return;
  }

  function poblar(valorPadre, valorHijoInicial) {
    selectHijo.innerHTML = "";

    if (!valorPadre) {
      selectHijo.appendChild(new Option(textoVacio, ""));
      selectHijo.disabled = true;
      return;
    }

    selectHijo.appendChild(new Option("Selecciona una opcion", ""));

    obtenerOpciones(valorPadre).forEach(function (opcion) {
      const nodo = new Option(opcion.nombre, opcion.id);
      selectHijo.appendChild(nodo);
    });

    selectHijo.disabled = false;

    if (valorHijoInicial) {
      selectHijo.value = valorHijoInicial;
    }
  }

  selectPadre.addEventListener("change", function () {
    poblar(selectPadre.value, null);
    UI.limpiarError(selectHijo, false);
  });

  return poblar;
}

/* ==========================================================================
   Formularios de la tienda
   ========================================================================== */

function destinoSegunPerfil(tipo) {
  return tipo === "administrador" || tipo === "vendedor" ? "admin/index.html" : "index.html";
}

function conectarLogin() {
  const formulario = document.querySelector("#formLogin");

  if (!formulario) {
    return;
  }

  conectarFormulario(
    formulario,
    {
      correo: Validaciones.correo,
      contrasena: Validaciones.contrasena
    },
    function () {
      const campoCorreo = formulario.querySelector("#correo");
      const correo = campoCorreo.value.trim().toLowerCase();

      const usuario = usuariosVigentes().find(function (item) {
        return item.correo.toLowerCase() === correo;
      });

      /* Sin servidor no hay verificacion real de credenciales: el ERS lo declara
         en la seccion 3.3.2. Se comprueba que la cuenta exista y se respetan las
         reglas de formato del levantamiento. */
      if (!usuario) {
        UI.mostrarError(campoCorreo, "No existe una cuenta registrada con ese correo.");
        return;
      }

      Sesion.iniciar(usuario);
      UI.notificar("Bienvenido de vuelta, " + usuario.nombre + ".", "exito");

      const parametros = new URLSearchParams(window.location.search);
      const pedido = parametros.get("destino");

      let destino = destinoSegunPerfil(usuario.tipo);

      if (pedido === "admin" && Sesion.puedeEntrarAdmin()) {
        destino = "admin/index.html";
      } else if (pedido === "carrito") {
        destino = "carrito.html";
      }

      window.setTimeout(function () {
        window.location.href = destino;
      }, 800);
    }
  );
}

function conectarRegistro() {
  const formulario = document.querySelector("#formRegistro");

  if (!formulario) {
    return;
  }

  const selectRegion = formulario.querySelector("#region");
  const selectComuna = formulario.querySelector("#comuna");

  REGIONES.forEach(function (region) {
    selectRegion.appendChild(new Option(region.nombre, region.id));
  });

  const poblarComunas = encadenarSelects(
    selectRegion,
    selectComuna,
    function (idRegion) {
      const region = REGIONES.find(function (item) {
        return item.id === idRegion;
      });
      return region ? region.comunas : [];
    },
    "Elige una region primero"
  );

  poblarComunas("", null);

  conectarFormulario(
    formulario,
    {
      run: function (valor) {
        const base = Validaciones.run(valor);

        if (!base.valido) {
          return base;
        }

        const repetido = usuariosVigentes().some(function (usuario) {
          return usuario.run.toUpperCase() === valor.trim().toUpperCase();
        });

        if (repetido) {
          return { valido: false, mensaje: "Ya existe una cuenta con ese RUN." };
        }

        return base;
      },
      nombre: Validaciones.nombre,
      apellidos: Validaciones.apellidos,
      correo: function (valor) {
        const base = Validaciones.correo(valor);

        if (!base.valido) {
          return base;
        }

        const repetido = usuariosVigentes().some(function (usuario) {
          return usuario.correo.toLowerCase() === valor.trim().toLowerCase();
        });

        if (repetido) {
          return { valido: false, mensaje: "Ya existe una cuenta con ese correo." };
        }

        return base;
      },
      contrasena: Validaciones.contrasena,
      confirmacion: function (valor, form) {
        return Validaciones.confirmacion(valor, form.querySelector("#contrasena").value);
      },
      telefono: Validaciones.telefono,
      fechaNacimiento: Validaciones.fechaNacimiento,
      region: function (valor) {
        return Validaciones.seleccion(valor, "una region");
      },
      comuna: function (valor) {
        return Validaciones.seleccion(valor, "una comuna");
      },
      direccion: Validaciones.direccion
    },
    function () {
      const usuario = {
        run: formulario.querySelector("#run").value.trim().toUpperCase(),
        nombre: formulario.querySelector("#nombre").value.trim(),
        apellidos: formulario.querySelector("#apellidos").value.trim(),
        correo: formulario.querySelector("#correo").value.trim().toLowerCase(),
        telefono: formulario.querySelector("#telefono").value.trim(),
        fechaNacimiento: formulario.querySelector("#fechaNacimiento").value || null,
        tipo: "cliente",
        region: selectRegion.value,
        comuna: selectComuna.value,
        direccion: formulario.querySelector("#direccion").value.trim()
      };

      const lista = usuariosVigentes().slice();
      lista.push(usuario);
      Almacen.escribir(CLAVES.usuarios, lista);

      Sesion.iniciar(usuario);
      UI.notificar("Cuenta creada. Bienvenido a Botanik, " + usuario.nombre + ".", "exito");

      window.setTimeout(function () {
        window.location.href = "index.html";
      }, 1000);
    }
  );
}

function conectarContacto() {
  const formulario = document.querySelector("#formContacto");

  if (!formulario) {
    return;
  }

  const comentario = formulario.querySelector("#comentario");
  const contador = formulario.querySelector("[data-bt-contador-comentario]");

  if (contador) {
    comentario.addEventListener("input", function () {
      contador.textContent = comentario.value.length + " de 500 caracteres";
    });
  }

  conectarFormulario(
    formulario,
    {
      nombre: Validaciones.nombreContacto,
      correo: Validaciones.correo,
      comentario: Validaciones.comentario
    },
    function () {
      /* Esta entrega no envia correo: se declara en la seccion 1.2 del ERS. */
      formulario.reset();
      UI.limpiarFormulario(formulario);

      if (contador) {
        contador.textContent = "0 de 500 caracteres";
      }

      document.querySelector("[data-bt-contacto-enviado]").classList.remove("d-none");
      UI.notificar("Mensaje registrado. Te responderemos al correo indicado.", "exito");
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  conectarLogin();
  conectarRegistro();
  conectarContacto();
});
