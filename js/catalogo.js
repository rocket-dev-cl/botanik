/**
 * Botanik — Grilla, filtros y detalle de producto.
 * Se carga en: index.html, productos.html, detalle-producto.html
 *
 * La grilla nunca se escribe a mano en el HTML: se genera desde el arreglo de
 * datos (R.2), de modo que cargar un producto nuevo no obliga a tocar marcado.
 */

const SIN_IMAGEN = "img/ui/sin-imagen.svg";

function nombreCategoria(idCategoria) {
  const categoria = CATEGORIAS.find(function (item) {
    return item.id === idCategoria;
  });

  return categoria ? categoria.nombre : idCategoria;
}

function nombreSubcategoria(idCategoria, idSubcategoria) {
  const categoria = CATEGORIAS.find(function (item) {
    return item.id === idCategoria;
  });

  if (!categoria) {
    return idSubcategoria;
  }

  const subcategoria = categoria.subcategorias.find(function (item) {
    return item.id === idSubcategoria;
  });

  return subcategoria ? subcategoria.nombre : idSubcategoria;
}

function nombreEtiqueta(idEtiqueta) {
  const etiqueta = ETIQUETAS.find(function (item) {
    return item.id === idEtiqueta;
  });

  return etiqueta ? etiqueta.nombre : idEtiqueta;
}

function precioVisible(producto) {
  if (producto.precio === 0) {
    return '<span class="bt-precio-libre">Gratis</span>';
  }

  return '<span class="bt-precio">' + UI.formatearPrecio(producto.precio) + "</span>";
}

function tarjetaProducto(producto) {
  const imagen = producto.imagen || SIN_IMAGEN;
  const primeraEtiqueta = (producto.etiquetas && producto.etiquetas.length > 0)
    ? '<span class="bt-producto-etiqueta-foto">' + nombreEtiqueta(producto.etiquetas[0]) + "</span>"
    : "";

  const agotado = producto.stock === 0;
  const enlace = "detalle-producto.html?codigo=" + producto.codigo;

  const boton = agotado
    ? '<span class="bt-agotado">Agotado</span>'
    : '<button class="btn btn-primary btn-sm bt-producto-agregar" type="button" data-bt-agregar="' +
        producto.codigo + '" aria-label="Anadir ' + producto.nombre + ' al carrito">+</button>';

  return '' +
    '<article class="bt-producto">' +
      primeraEtiqueta +
      '<a class="bt-producto-figura" href="' + enlace + '" tabindex="-1" aria-hidden="true">' +
        '<img class="bt-producto-img" src="' + imagen + '" alt="' + producto.nombre + '" loading="lazy">' +
      '</a>' +
      '<div class="bt-producto-cuerpo">' +
        '<h3 class="bt-producto-nombre"><a href="' + enlace + '">' + producto.nombre + "</a></h3>" +
        '<div class="bt-producto-pie">' +
          precioVisible(producto) +
          boton +
        "</div>" +
      "</div>" +
    "</article>";
}

function pintarGrilla(contenedor, productos) {
  const vacio = document.querySelector("[data-bt-grilla-vacia]");

  if (productos.length === 0) {
    contenedor.innerHTML = "";

    if (vacio) {
      vacio.classList.remove("d-none");
    }
    return;
  }

  if (vacio) {
    vacio.classList.add("d-none");
  }

  contenedor.innerHTML = productos.map(function (producto) {
    return '<div class="col">' + tarjetaProducto(producto) + "</div>";
  }).join("");
}

function pintarDestacados() {
  const contenedor = document.querySelector("[data-bt-destacados]");

  if (!contenedor) {
    return;
  }

  const destacados = productosVigentes().filter(function (producto) {
    return producto.destacado === true;
  }).slice(0, 8);

  pintarGrilla(contenedor, destacados);
}

function pintarResumenCategorias() {
  const contenedor = document.querySelector("[data-bt-categorias-home]");

  if (!contenedor) {
    return;
  }

  const productos = productosVigentes();

  contenedor.innerHTML = CATEGORIAS.map(function (categoria) {
    const cuantos = productos.filter(function (producto) {
      return producto.categoria === categoria.id;
    }).length;

    const subcategorias = categoria.subcategorias.map(function (sub) {
      return sub.nombre;
    }).join(" y ");

    return '' +
      '<div class="col-6 col-lg-3">' +
        '<a class="bt-categoria-tarjeta" href="productos.html?categoria=' + categoria.id + '">' +
          "<strong>" + categoria.nombre + "</strong>" +
          "<span>" + cuantos + " productos &middot; " + subcategorias + "</span>" +
        "</a>" +
      "</div>";
  }).join("");
}

const Filtros = (function () {
  const estado = { categoria: "", subcategoria: "", etiquetas: [] };

  function selectCategoria() {
    return document.querySelector("#filtroCategoria");
  }

  function selectSubcategoria() {
    return document.querySelector("#filtroSubcategoria");
  }

  function contenedorEtiquetas() {
    return document.querySelector("[data-bt-filtro-etiquetas]");
  }

  function aplicables() {
    return productosVigentes().filter(function (producto) {
      if (estado.categoria && producto.categoria !== estado.categoria) {
        return false;
      }

      if (estado.subcategoria && producto.subcategoria !== estado.subcategoria) {
        return false;
      }

      if (estado.etiquetas.length > 0) {
        const propias = producto.etiquetas || [];
        const tieneTodas = estado.etiquetas.every(function (etiqueta) {
          return propias.indexOf(etiqueta) !== -1;
        });

        if (!tieneTodas) {
          return false;
        }
      }

      return true;
    });
  }

  /* Las etiquetas visibles dependen de la categoria elegida: mostrar todas las
     del catalogo llenaria la vista de filtros que no devuelven resultados. */
  function pintarEtiquetas() {
    const contenedor = contenedorEtiquetas();

    if (!contenedor) {
      return;
    }

    const disponibles = ETIQUETAS.filter(function (etiqueta) {
      return estado.categoria === "" || etiqueta.categoria === estado.categoria;
    });

    contenedor.innerHTML = disponibles.map(function (etiqueta) {
      const marcada = estado.etiquetas.indexOf(etiqueta.id) !== -1;

      return '' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="checkbox" id="etiqueta-' + etiqueta.id + '" value="' + etiqueta.id + '"' +
            (marcada ? " checked" : "") + ">" +
          '<label class="form-check-label" for="etiqueta-' + etiqueta.id + '">' + etiqueta.nombre + "</label>" +
        "</div>";
    }).join("");
  }

  function pintarResultado() {
    const contenedor = document.querySelector("[data-bt-grilla-productos]");

    if (!contenedor) {
      return;
    }

    const resultado = aplicables();
    pintarGrilla(contenedor, resultado);

    const conteo = document.querySelector("[data-bt-conteo-resultado]");

    if (conteo) {
      const total = productosVigentes().length;
      conteo.textContent = resultado.length === total
        ? "Mostrando los " + total + " productos del catalogo"
        : "Mostrando " + resultado.length + " de " + total + " productos";
    }
  }

  function iniciar() {
    const categoria = selectCategoria();
    const subcategoria = selectSubcategoria();

    if (!categoria) {
      return;
    }

    CATEGORIAS.forEach(function (item) {
      categoria.appendChild(new Option(item.nombre, item.id));
    });

    const poblarSubcategorias = encadenarSelects(
      categoria,
      subcategoria,
      function (idCategoria) {
        const encontrada = CATEGORIAS.find(function (item) {
          return item.id === idCategoria;
        });
        return encontrada ? encontrada.subcategorias : [];
      },
      "Elige una categoria primero"
    );

    const parametros = new URLSearchParams(window.location.search);
    const categoriaInicial = parametros.get("categoria") || "";

    if (categoriaInicial && CATEGORIAS.some(function (item) { return item.id === categoriaInicial; })) {
      categoria.value = categoriaInicial;
      estado.categoria = categoriaInicial;
    }

    poblarSubcategorias(estado.categoria, null);

    categoria.addEventListener("change", function () {
      estado.categoria = categoria.value;
      estado.subcategoria = "";
      estado.etiquetas = [];
      pintarEtiquetas();
      pintarResultado();
    });

    subcategoria.addEventListener("change", function () {
      estado.subcategoria = subcategoria.value;
      pintarResultado();
    });

    const contenedor = contenedorEtiquetas();

    if (contenedor) {
      contenedor.addEventListener("change", function (evento) {
        const casilla = evento.target.closest(".form-check-input");

        if (!casilla) {
          return;
        }

        if (casilla.checked) {
          estado.etiquetas.push(casilla.value);
        } else {
          estado.etiquetas = estado.etiquetas.filter(function (etiqueta) {
            return etiqueta !== casilla.value;
          });
        }

        pintarResultado();
      });
    }

    const limpiar = document.querySelector("[data-bt-limpiar-filtros]");

    if (limpiar) {
      limpiar.addEventListener("click", function () {
        estado.categoria = "";
        estado.subcategoria = "";
        estado.etiquetas = [];
        categoria.value = "";
        poblarSubcategorias("", null);
        pintarEtiquetas();
        pintarResultado();
      });
    }

    pintarEtiquetas();
    pintarResultado();
  }

  return { iniciar: iniciar };
})();

function pintarDetalle() {
  const contenedor = document.querySelector("[data-bt-detalle]");

  if (!contenedor) {
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  const producto = buscarProducto(parametros.get("codigo"));
  const noEncontrado = document.querySelector("[data-bt-detalle-vacio]");

  if (!producto) {
    contenedor.classList.add("d-none");
    noEncontrado.classList.remove("d-none");
    return;
  }

  document.title = producto.nombre + " | Botanik";

  const galeria = (producto.imagenes && producto.imagenes.length > 0)
    ? producto.imagenes
    : [producto.imagen || SIN_IMAGEN];

  document.querySelector("[data-bt-migaja-categoria]").textContent = nombreCategoria(producto.categoria);
  document.querySelector("[data-bt-migaja-categoria]").href = "productos.html?categoria=" + producto.categoria;
  document.querySelector("[data-bt-migaja-producto]").textContent = producto.nombre;

  document.querySelector("[data-bt-detalle-codigo]").textContent =
    producto.codigo + " · " + nombreCategoria(producto.categoria) + " / " + nombreSubcategoria(producto.categoria, producto.subcategoria);
  document.querySelector("[data-bt-detalle-nombre]").textContent = producto.nombre;
  document.querySelector("[data-bt-detalle-precio]").innerHTML = producto.precio === 0
    ? '<span class="bt-precio-libre">Producto gratuito</span>'
    : UI.formatearPrecio(producto.precio);
  document.querySelector("[data-bt-detalle-descripcion]").textContent =
    producto.descripcion || "Este producto todavia no tiene descripcion.";

  const principal = document.querySelector("[data-bt-imagen-principal]");
  principal.src = galeria[0];
  principal.alt = producto.nombre;

  const miniaturas = document.querySelector("[data-bt-miniaturas]");
  miniaturas.innerHTML = galeria.map(function (ruta, indice) {
    return '<img class="bt-miniatura' + (indice === 0 ? " activa" : "") + '" src="' + ruta +
      '" alt="Vista ' + (indice + 1) + " de " + producto.nombre + '" data-bt-miniatura>';
  }).join("");

  miniaturas.classList.toggle("d-none", galeria.length < 2);

  miniaturas.addEventListener("click", function (evento) {
    const elegida = evento.target.closest("[data-bt-miniatura]");

    if (!elegida) {
      return;
    }

    principal.src = elegida.src;
    miniaturas.querySelectorAll(".bt-miniatura").forEach(function (nodo) {
      nodo.classList.toggle("activa", nodo === elegida);
    });
  });

  const listaEtiquetas = document.querySelector("[data-bt-detalle-etiquetas]");
  const etiquetas = producto.etiquetas || [];

  listaEtiquetas.innerHTML = etiquetas.map(function (etiqueta) {
    return '<li class="bt-etiqueta">' + nombreEtiqueta(etiqueta) + "</li>";
  }).join("");
  listaEtiquetas.classList.toggle("d-none", etiquetas.length === 0);

  const stock = document.querySelector("[data-bt-detalle-stock]");
  const acciones = document.querySelector("[data-bt-detalle-acciones]");

  if (producto.stock === 0) {
    stock.textContent = "Sin stock por ahora.";
    stock.className = "bt-agotado";
    acciones.classList.add("d-none");
  } else {
    stock.textContent = producto.stock + " unidades disponibles · despacho en 2 a 4 dias habiles";
    stock.className = "text-body-secondary small";

    const campoCantidad = document.querySelector("[data-bt-cantidad-detalle]");
    campoCantidad.max = producto.stock;

    const botonAgregar = document.querySelector("[data-bt-detalle-acciones] [data-bt-agregar]");
    botonAgregar.dataset.btAgregar = producto.codigo;
  }

  pintarRelacionados(producto);
}

function pintarRelacionados(producto) {
  const contenedor = document.querySelector("[data-bt-relacionados]");

  if (!contenedor) {
    return;
  }

  const relacionados = productosVigentes().filter(function (item) {
    return item.categoria === producto.categoria && item.codigo !== producto.codigo;
  }).slice(0, 5);

  document.querySelector("[data-bt-seccion-relacionados]").classList.toggle("d-none", relacionados.length === 0);

  contenedor.innerHTML = relacionados.map(function (item) {
    return '<div class="col">' + tarjetaProducto(item) + "</div>";
  }).join("");
}

function conectarCantidadDetalle() {
  const campo = document.querySelector("[data-bt-cantidad-detalle]");

  if (!campo) {
    return;
  }

  document.querySelector("[data-bt-cantidad-menos]").addEventListener("click", function () {
    campo.value = Math.max(1, Number(campo.value) - 1);
  });

  document.querySelector("[data-bt-cantidad-mas]").addEventListener("click", function () {
    const tope = Number(campo.max) || 99;
    campo.value = Math.min(tope, Number(campo.value) + 1);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  pintarDestacados();
  pintarResumenCategorias();
  Filtros.iniciar();
  pintarDetalle();
  conectarCantidadDetalle();
});
