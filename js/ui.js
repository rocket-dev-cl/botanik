/**
 * Botanik — Componentes de interfaz sobre Bootstrap.
 *
 * El marcado del modal y del contenedor de toasts se inyecta una sola vez desde
 * aqui en lugar de repetirlo en las 16 vistas. No se usa alert() ni confirm()
 * en ningun punto del proyecto (R.21).
 */

const UI = (function () {
  const ID_MODAL = "btModalConfirmar";
  const ID_TOASTS = "btContenedorToasts";

  let modalBootstrap = null;

  function inyectarModal() {
    if (document.getElementById(ID_MODAL)) {
      return;
    }

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = ID_MODAL;
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", ID_MODAL + "Titulo");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<h2 class="modal-title fs-5" id="' + ID_MODAL + 'Titulo">Confirmar</h2>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>' +
          '</div>' +
          '<div class="modal-body"><p class="mb-0" data-bt-mensaje></p></div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-bt-cancelar>Cancelar</button>' +
            '<button type="button" class="btn btn-danger" data-bt-aceptar>Confirmar</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modalBootstrap = new bootstrap.Modal(modal);
  }

  function inyectarToasts() {
    if (document.getElementById(ID_TOASTS)) {
      return;
    }

    const contenedor = document.createElement("div");
    contenedor.id = ID_TOASTS;
    contenedor.className = "bt-toasts";
    contenedor.setAttribute("aria-live", "polite");
    contenedor.setAttribute("aria-atomic", "true");
    document.body.appendChild(contenedor);
  }

  function iniciar() {
    inyectarModal();
    inyectarToasts();
  }

  function confirmar(mensaje, opciones) {
    inyectarModal();

    const config = opciones || {};
    const modal = document.getElementById(ID_MODAL);
    const titulo = modal.querySelector(".modal-title");
    const cuerpo = modal.querySelector("[data-bt-mensaje]");
    const aceptar = modal.querySelector("[data-bt-aceptar]");

    titulo.textContent = config.titulo || "Confirmar";
    cuerpo.textContent = mensaje;
    aceptar.textContent = config.textoAceptar || "Confirmar";
    aceptar.className = "btn " + (config.claseAceptar || "btn-danger");

    return new Promise(function (resolver) {
      let respuesta = false;

      function alAceptar() {
        respuesta = true;
        modalBootstrap.hide();
      }

      function alCerrar() {
        aceptar.removeEventListener("click", alAceptar);
        modal.removeEventListener("hidden.bs.modal", alCerrar);
        resolver(respuesta);
      }

      aceptar.addEventListener("click", alAceptar);
      modal.addEventListener("hidden.bs.modal", alCerrar);
      modalBootstrap.show();
    });
  }

  function notificar(mensaje, tipo) {
    inyectarToasts();

    const clases = {
      exito: "bt-toast-exito",
      error: "bt-toast-error",
      aviso: "bt-toast-aviso"
    };

    const toast = document.createElement("div");
    toast.className = "toast align-items-center " + (clases[tipo] || clases.exito);
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML =
      '<div class="d-flex">' +
        '<div class="toast-body"></div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>' +
      '</div>';
    toast.querySelector(".toast-body").textContent = mensaje;

    document.getElementById(ID_TOASTS).appendChild(toast);

    const instancia = new bootstrap.Toast(toast, { delay: 3500 });
    toast.addEventListener("hidden.bs.toast", function () {
      toast.remove();
    });
    instancia.show();
  }

  /* El contenedor del mensaje se busca por data-bt-error="<id del campo>" para
     que el error quede junto al campo aunque el marcado intercale otros nodos. */
  function contenedorError(campo) {
    let destino = document.querySelector('[data-bt-error="' + campo.id + '"]');

    if (!destino) {
      destino = campo.parentElement.querySelector(".invalid-feedback");
    }

    if (!destino) {
      destino = document.createElement("div");
      destino.className = "invalid-feedback d-block";
      campo.insertAdjacentElement("afterend", destino);
    }

    return destino;
  }

  function mostrarError(campo, mensaje) {
    if (!campo) {
      return;
    }

    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    campo.setAttribute("aria-invalid", "true");

    const destino = contenedorError(campo);
    destino.textContent = mensaje;
    destino.classList.add("d-block");
  }

  function limpiarError(campo, marcarValido) {
    if (!campo) {
      return;
    }

    campo.classList.remove("is-invalid");
    campo.removeAttribute("aria-invalid");

    if (marcarValido) {
      campo.classList.add("is-valid");
    } else {
      campo.classList.remove("is-valid");
    }

    const destino = contenedorError(campo);
    destino.textContent = "";
    destino.classList.remove("d-block");
  }

  function limpiarFormulario(formulario) {
    formulario.querySelectorAll(".is-invalid, .is-valid").forEach(function (campo) {
      limpiarError(campo, false);
    });
  }

  function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
  }

  return {
    iniciar: iniciar,
    confirmar: confirmar,
    notificar: notificar,
    mostrarError: mostrarError,
    limpiarError: limpiarError,
    limpiarFormulario: limpiarFormulario,
    formatearPrecio: formatearPrecio
  };
})();

document.addEventListener("DOMContentLoaded", UI.iniciar);
