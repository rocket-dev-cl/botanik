/**
 * Botanik — Modulo de administracion.
 * Se carga en las vistas de admin/
 *
 * Los mantenedores escriben sobre una copia del catalogo en localStorage. El
 * arreglo de js/data/ queda como estado de fabrica y se puede restaurar.
 *
 * Perfiles: administrador (acceso total), vendedor (solo consulta de productos),
 * cliente (no entra).
 */

const PERFILES = [
  { id: "administrador", nombre: "Administrador" },
  { id: "vendedor", nombre: "Vendedor" },
  { id: "cliente", nombre: "Cliente" }
];

const POR_PAGINA = 8;

const Acceso = (function () {
  function exigirSesion() {
    const sesion = Sesion.obtener();

    if (!sesion) {
      window.location.replace("../login.html?destino=admin");
      return null;
    }

    if (!Sesion.puedeEntrarAdmin()) {
      window.location.replace("../index.html?acceso=denegado");
      return null;
    }

    return sesion;
  }

  /* Las opciones ajenas al rol se quitan del DOM en vez de deshabilitarse: el
     criterio de R.24 es que no aparezcan. */
  function aplicarPerfil(sesion) {
    document.querySelectorAll("[data-bt-solo-administrador]").forEach(function (nodo) {
      if (sesion.tipo !== "administrador") {
        nodo.remove();
      }
    });

    document.querySelectorAll("[data-bt-nombre-admin]").forEach(function (nodo) {
      nodo.textContent = sesion.nombre + " " + sesion.apellidos;
    });

    document.querySelectorAll("[data-bt-perfil-admin]").forEach(function (nodo) {
      const perfil = PERFILES.find(function (item) {
        return item.id === sesion.tipo;
      });
      nodo.textContent = perfil ? perfil.nombre : sesion.tipo;
    });

    document.querySelectorAll("[data-bt-iniciales-admin]").forEach(function (nodo) {
      nodo.textContent = (sesion.nombre.charAt(0) + sesion.apellidos.charAt(0)).toUpperCase();
    });
  }

  return { exigirSesion: exigirSesion, aplicarPerfil: aplicarPerfil };
})();

const RepoProductos = {
  todos: function () {
    return productosVigentes();
  },

  guardarTodos: function (lista) {
    Almacen.escribir(CLAVES.productos, lista);
  },

  porCodigo: function (codigo) {
    return this.todos().find(function (producto) {
      return producto.codigo === codigo;
    }) || null;
  },

  codigoDuplicado: function (codigo, codigoOriginal) {
    return this.todos().some(function (producto) {
      return producto.codigo === codigo && producto.codigo !== codigoOriginal;
    });
  },

  crear: function (producto) {
    const lista = this.todos().slice();
    lista.push(producto);
    this.guardarTodos(lista);
  },

  actualizar: function (codigoOriginal, producto) {
    const lista = this.todos().map(function (item) {
      return item.codigo === codigoOriginal ? producto : item;
    });
    this.guardarTodos(lista);
  },

  eliminar: function (codigo) {
    this.guardarTodos(this.todos().filter(function (producto) {
      return producto.codigo !== codigo;
    }));
  },

  enCritico: function () {
    return this.todos().filter(function (producto) {
      const critico = Number(producto.stockCritico);
      return Number.isFinite(critico) && Number(producto.stock) <= critico;
    });
  }
};

const RepoUsuarios = {
  todos: function () {
    return usuariosVigentes();
  },

  guardarTodos: function (lista) {
    Almacen.escribir(CLAVES.usuarios, lista);
  },

  porRun: function (run) {
    return this.todos().find(function (usuario) {
      return usuario.run === run;
    }) || null;
  },

  duplicado: function (campo, valor, runOriginal) {
    return this.todos().some(function (usuario) {
      return usuario[campo] === valor && usuario.run !== runOriginal;
    });
  },

  crear: function (usuario) {
    const lista = this.todos().slice();
    lista.push(usuario);
    this.guardarTodos(lista);
  },

  actualizar: function (runOriginal, usuario) {
    const lista = this.todos().map(function (item) {
      return item.run === runOriginal ? usuario : item;
    });
    this.guardarTodos(lista);
  },

  eliminar: function (run) {
    this.guardarTodos(this.todos().filter(function (usuario) {
      return usuario.run !== run;
    }));
  }
};

const RepoOrdenes = {
  todas: function () {
    return ordenesVigentes();
  },

  guardarTodas: function (lista) {
    Almacen.escribir(CLAVES.ordenes, lista);
  },

  porNumero: function (numero) {
    return this.todas().find(function (orden) {
      return orden.numero === numero;
    }) || null;
  },

  cambiarEstado: function (numero, estado) {
    this.guardarTodas(this.todas().map(function (orden) {
      return orden.numero === numero ? Object.assign({}, orden, { estado: estado }) : orden;
    }));
  },

  /* Una orden cancelada no se cuenta como venta. */
  totalVendido: function () {
    return this.todas().reduce(function (suma, orden) {
      return orden.estado === "cancelada" ? suma : suma + orden.total;
    }, 0);
  },

  porDespachar: function () {
    return this.todas().filter(function (orden) {
      return orden.estado === "pendiente" || orden.estado === "preparacion";
    });
  }
};

function nombreEstado(idEstado) {
  const estado = ESTADOS_ORDEN.find(function (item) {
    return item.id === idEstado;
  });

  return estado ? estado.nombre : idEstado;
}

function fechaLegible(iso) {
  const partes = String(iso).split("-");

  if (partes.length !== 3) {
    return iso;
  }

  return partes[2] + "-" + partes[1] + "-" + partes[0];
}

function itemsDeOrden(orden) {
  return orden.lineas.reduce(function (suma, linea) {
    return suma + linea.cantidad;
  }, 0);
}

/**
 * Tabla con orden por columna, busqueda y paginacion (R.17).
 * El orden y la busqueda se conservan al cambiar de pagina porque el estado
 * vive aqui y no en el DOM.
 */
function crearTabla(config) {
  const estado = { campo: config.ordenInicial, direccion: "asc", pagina: 1, busqueda: "", filtro: "" };

  function comparar(a, b) {
    const valorA = config.valorOrden(a, estado.campo);
    const valorB = config.valorOrden(b, estado.campo);

    if (typeof valorA === "number" && typeof valorB === "number") {
      return estado.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const textoA = String(valorA).toLowerCase();
    const textoB = String(valorB).toLowerCase();

    if (textoA === textoB) {
      return 0;
    }

    const orden = textoA < textoB ? -1 : 1;
    return estado.direccion === "asc" ? orden : -orden;
  }

  function visibles() {
    return config.fuente()
      .filter(function (item) {
        return config.coincide(item, estado.busqueda, estado.filtro);
      })
      .sort(comparar);
  }

  function pintarPaginacion(total) {
    const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

    if (estado.pagina > paginas) {
      estado.pagina = paginas;
    }

    const lista = config.paginacion;
    const partes = [];

    partes.push(
      '<li class="page-item' + (estado.pagina === 1 ? " disabled" : "") + '">' +
        '<button class="page-link" type="button" data-bt-pagina-ir="' + (estado.pagina - 1) + '">Anterior</button>' +
      "</li>"
    );

    for (let numero = 1; numero <= paginas; numero++) {
      partes.push(
        '<li class="page-item' + (numero === estado.pagina ? " active" : "") + '">' +
          '<button class="page-link" type="button" data-bt-pagina-ir="' + numero + '"' +
          (numero === estado.pagina ? ' aria-current="page"' : "") + ">" + numero + "</button>" +
        "</li>"
      );
    }

    partes.push(
      '<li class="page-item' + (estado.pagina === paginas ? " disabled" : "") + '">' +
        '<button class="page-link" type="button" data-bt-pagina-ir="' + (estado.pagina + 1) + '">Siguiente</button>' +
      "</li>"
    );

    lista.innerHTML = partes.join("");
  }

  function pintar() {
    const filas = visibles();
    const total = filas.length;
    const desde = (estado.pagina - 1) * POR_PAGINA;
    const pagina = filas.slice(desde, desde + POR_PAGINA);

    config.cuerpo.innerHTML = pagina.length === 0
      ? '<tr><td colspan="' + config.columnas + '" class="text-center text-body-secondary py-4">' +
          config.textoVacio + "</td></tr>"
      : pagina.map(config.fila).join("");

    if (config.info) {
      config.info.textContent = total === 0
        ? "Sin resultados"
        : "Mostrando " + (desde + 1) + " a " + Math.min(desde + POR_PAGINA, total) + " de " + total;
    }

    pintarPaginacion(total);

    config.encabezados.forEach(function (boton) {
      if (boton.dataset.btOrden === estado.campo) {
        boton.dataset.btDireccion = estado.direccion;
      } else {
        delete boton.dataset.btDireccion;
      }
    });

    if (config.alPintar) {
      config.alPintar(total);
    }
  }

  config.encabezados.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const campo = boton.dataset.btOrden;

      if (estado.campo === campo) {
        estado.direccion = estado.direccion === "asc" ? "desc" : "asc";
      } else {
        estado.campo = campo;
        estado.direccion = "asc";
      }

      pintar();
    });
  });

  config.paginacion.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-bt-pagina-ir]");

    if (!boton || boton.closest(".page-item").classList.contains("disabled")) {
      return;
    }

    estado.pagina = Number(boton.dataset.btPaginaIr);
    pintar();
  });

  if (config.buscador) {
    config.buscador.addEventListener("input", function () {
      estado.busqueda = config.buscador.value.trim().toLowerCase();
      estado.pagina = 1;
      pintar();
    });
  }

  if (config.selectorFiltro) {
    config.selectorFiltro.addEventListener("change", function () {
      estado.filtro = config.selectorFiltro.value;
      estado.pagina = 1;
      pintar();
    });
  }

  return { pintar: pintar };
}

function iniciarPanel(sesion) {
  const contenedor = document.querySelector("[data-bt-panel-indicadores]");

  if (!contenedor) {
    return;
  }

  document.querySelector("[data-bt-saludo]").textContent = "Hola, " + sesion.nombre;

  const productos = RepoProductos.todos();
  const criticos = RepoProductos.enCritico();
  const usuarios = RepoUsuarios.todos();

  const indicadores = [
    { valor: UI.formatearPrecio(RepoOrdenes.totalVendido()), texto: "vendido en total" },
    { valor: RepoOrdenes.porDespachar().length, texto: "ordenes por despachar" },
    { valor: productos.length, texto: "productos en el catalogo" },
    { valor: criticos.length, texto: "en stock critico" },
    { valor: usuarios.length, texto: "usuarios registrados" }
  ];

  if (sesion.tipo !== "administrador") {
    indicadores.pop();
  }

  contenedor.innerHTML = indicadores.map(function (indicador) {
    return '<div class="col-6 col-lg-4"><div class="bt-tarjeta-indicador">' +
      "<strong>" + indicador.valor + "</strong><span>" + indicador.texto + "</span>" +
      "</div></div>";
  }).join("");

  const aviso = document.querySelector("[data-bt-aviso-critico]");

  if (aviso && criticos.length > 0) {
    aviso.classList.remove("d-none");
    aviso.querySelector("[data-bt-aviso-texto]").textContent =
      criticos.length === 1
        ? "1 producto alcanzo su stock critico: " + criticos[0].nombre + "."
        : criticos.length + " productos alcanzaron su stock critico: " +
          criticos.map(function (p) { return p.nombre; }).join(", ") + ".";
  }
}

function iniciarListadoProductos(sesion) {
  const cuerpo = document.querySelector("[data-bt-cuerpo-productos]");

  if (!cuerpo) {
    return;
  }

  const puedeEditar = sesion.tipo === "administrador";
  const selectorCategoria = document.querySelector("#filtroCategoriaAdmin");

  if (selectorCategoria) {
    CATEGORIAS.forEach(function (categoria) {
      selectorCategoria.appendChild(new Option(categoria.nombre, categoria.id));
    });
  }

  const tabla = crearTabla({
    cuerpo: cuerpo,
    columnas: puedeEditar ? 7 : 6,
    textoVacio: "Ningun producto coincide con la busqueda.",
    ordenInicial: "codigo",
    encabezados: Array.from(document.querySelectorAll("[data-bt-orden]")),
    paginacion: document.querySelector("[data-bt-paginacion]"),
    info: document.querySelector("[data-bt-info-tabla]"),
    buscador: document.querySelector("#buscadorProductos"),
    selectorFiltro: selectorCategoria,
    fuente: function () {
      return RepoProductos.todos();
    },
    valorOrden: function (producto, campo) {
      if (campo === "precio" || campo === "stock") {
        return Number(producto[campo]);
      }
      if (campo === "categoria") {
        return nombreCategoriaAdmin(producto.categoria);
      }
      return producto[campo];
    },
    coincide: function (producto, busqueda, filtro) {
      if (filtro && producto.categoria !== filtro) {
        return false;
      }

      if (!busqueda) {
        return true;
      }

      return producto.codigo.toLowerCase().indexOf(busqueda) !== -1 ||
        producto.nombre.toLowerCase().indexOf(busqueda) !== -1;
    },
    fila: function (producto) {
      const critico = Number(producto.stockCritico);
      const enCritico = Number.isFinite(critico) && Number(producto.stock) <= critico;
      const agotado = Number(producto.stock) === 0;

      let claseFila = "";
      if (agotado) {
        claseFila = "bt-fila-critica bt-fila-agotada";
      } else if (enCritico) {
        claseFila = "bt-fila-critica";
      }

      let marca = "";
      if (agotado) {
        marca = ' <span class="bt-marca-agotado">agotado</span>';
      } else if (enCritico) {
        marca = ' <span class="bt-marca-critica">critico</span>';
      }

      const precio = producto.precio === 0
        ? '<span class="bt-precio-libre">Gratis</span>'
        : UI.formatearPrecio(producto.precio);

      const acciones = puedeEditar
        ? '<td class="text-end"><div class="bt-acciones">' +
            '<a class="btn btn-sm btn-outline-primary" href="producto-form.html?codigo=' + producto.codigo + '">Editar</a>' +
            '<button class="btn btn-sm btn-outline-secondary" type="button" data-bt-eliminar-producto="' + producto.codigo + '">Eliminar</button>' +
          "</div></td>"
        : "";

      return '<tr class="' + claseFila + '">' +
        "<td>" + producto.codigo + "</td>" +
        "<td>" + producto.nombre + "</td>" +
        "<td>" + nombreCategoriaAdmin(producto.categoria) + "</td>" +
        '<td class="bt-num">' + precio + "</td>" +
        '<td class="bt-num">' + producto.stock + marca + "</td>" +
        '<td class="bt-num">' + (producto.stockCritico === undefined ? "—" : producto.stockCritico) + "</td>" +
        acciones +
        "</tr>";
    }
  });

  cuerpo.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-bt-eliminar-producto]");

    if (!boton) {
      return;
    }

    const codigo = boton.dataset.btEliminarProducto;
    const producto = RepoProductos.porCodigo(codigo);

    UI.confirmar(
      "Se eliminara " + producto.nombre + " (" + codigo + ") del catalogo. Esta accion no se puede deshacer.",
      { titulo: "Eliminar producto", textoAceptar: "Eliminar" }
    ).then(function (confirmado) {
      if (!confirmado) {
        return;
      }

      RepoProductos.eliminar(codigo);
      tabla.pintar();
      UI.notificar("Producto eliminado.", "exito");
    });
  });

  tabla.pintar();
}

function nombreCategoriaAdmin(idCategoria) {
  const categoria = CATEGORIAS.find(function (item) {
    return item.id === idCategoria;
  });

  return categoria ? categoria.nombre : idCategoria;
}

function nombrePerfil(idPerfil) {
  const perfil = PERFILES.find(function (item) {
    return item.id === idPerfil;
  });

  return perfil ? perfil.nombre : idPerfil;
}

function nombreRegion(idRegion) {
  const region = REGIONES.find(function (item) {
    return item.id === idRegion;
  });

  return region ? region.nombre : idRegion;
}

function nombreComuna(idRegion, idComuna) {
  const region = REGIONES.find(function (item) {
    return item.id === idRegion;
  });

  if (!region) {
    return idComuna;
  }

  const comuna = region.comunas.find(function (item) {
    return item.id === idComuna;
  });

  return comuna ? comuna.nombre : idComuna;
}

function iniciarListadoUsuarios() {
  const cuerpo = document.querySelector("[data-bt-cuerpo-usuarios]");

  if (!cuerpo) {
    return;
  }

  const selectorPerfil = document.querySelector("#filtroPerfil");

  if (selectorPerfil) {
    PERFILES.forEach(function (perfil) {
      selectorPerfil.appendChild(new Option(perfil.nombre, perfil.id));
    });
  }

  const tabla = crearTabla({
    cuerpo: cuerpo,
    columnas: 6,
    textoVacio: "Ningun usuario coincide con la busqueda.",
    ordenInicial: "nombre",
    encabezados: Array.from(document.querySelectorAll("[data-bt-orden]")),
    paginacion: document.querySelector("[data-bt-paginacion]"),
    info: document.querySelector("[data-bt-info-tabla]"),
    buscador: document.querySelector("#buscadorUsuarios"),
    selectorFiltro: selectorPerfil,
    fuente: function () {
      return RepoUsuarios.todos();
    },
    valorOrden: function (usuario, campo) {
      if (campo === "nombre") {
        return usuario.nombre + " " + usuario.apellidos;
      }
      return usuario[campo];
    },
    coincide: function (usuario, busqueda, filtro) {
      if (filtro && usuario.tipo !== filtro) {
        return false;
      }

      if (!busqueda) {
        return true;
      }

      const texto = (usuario.run + " " + usuario.nombre + " " + usuario.apellidos + " " + usuario.correo).toLowerCase();
      return texto.indexOf(busqueda) !== -1;
    },
    fila: function (usuario) {
      return "<tr>" +
        "<td>" + usuario.run + "</td>" +
        "<td>" + usuario.nombre + " " + usuario.apellidos + "</td>" +
        "<td>" + usuario.correo + "</td>" +
        '<td><span class="bt-perfil bt-perfil-' + usuario.tipo + '">' + nombrePerfil(usuario.tipo) + "</span></td>" +
        "<td>" + nombreComuna(usuario.region, usuario.comuna) + ", " + nombreRegion(usuario.region) + "</td>" +
        '<td class="text-end"><div class="bt-acciones">' +
          '<a class="btn btn-sm btn-outline-primary" href="usuario-form.html?run=' + usuario.run + '">Editar</a>' +
          '<button class="btn btn-sm btn-outline-secondary" type="button" data-bt-eliminar-usuario="' + usuario.run + '">Eliminar</button>' +
        "</div></td>" +
        "</tr>";
    }
  });

  cuerpo.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-bt-eliminar-usuario]");

    if (!boton) {
      return;
    }

    const run = boton.dataset.btEliminarUsuario;
    const usuario = RepoUsuarios.porRun(run);
    const sesion = Sesion.obtener();

    if (sesion && sesion.run === run) {
      UI.notificar("No puedes eliminar el usuario con el que iniciaste sesion.", "error");
      return;
    }

    UI.confirmar(
      "Se eliminara a " + usuario.nombre + " " + usuario.apellidos + " (" + run + "). Esta accion no se puede deshacer.",
      { titulo: "Eliminar usuario", textoAceptar: "Eliminar" }
    ).then(function (confirmado) {
      if (!confirmado) {
        return;
      }

      RepoUsuarios.eliminar(run);
      tabla.pintar();
      UI.notificar("Usuario eliminado.", "exito");
    });
  });

  tabla.pintar();
}

function iniciarFormularioProducto() {
  const formulario = document.querySelector("#formProducto");

  if (!formulario) {
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  const codigoOriginal = parametros.get("codigo");
  const existente = codigoOriginal ? RepoProductos.porCodigo(codigoOriginal) : null;

  const selectCategoria = formulario.querySelector("#categoria");
  const selectSubcategoria = formulario.querySelector("#subcategoria");

  CATEGORIAS.forEach(function (categoria) {
    selectCategoria.appendChild(new Option(categoria.nombre, categoria.id));
  });

  const poblarSubcategorias = encadenarSelects(
    selectCategoria,
    selectSubcategoria,
    function (idCategoria) {
      const categoria = CATEGORIAS.find(function (item) {
        return item.id === idCategoria;
      });
      return categoria ? categoria.subcategorias : [];
    },
    "Elige una categoria primero"
  );

  const contenedorEtiquetas = formulario.querySelector("[data-bt-etiquetas-producto]");

  function pintarEtiquetas(seleccionadas) {
    const idCategoria = selectCategoria.value;
    const disponibles = ETIQUETAS.filter(function (etiqueta) {
      return etiqueta.categoria === idCategoria;
    });

    if (disponibles.length === 0) {
      contenedorEtiquetas.innerHTML =
        '<p class="form-text mb-0">Esta categoria no tiene etiquetas definidas.</p>';
      return;
    }

    contenedorEtiquetas.innerHTML = disponibles.map(function (etiqueta) {
      const marcada = seleccionadas.indexOf(etiqueta.id) !== -1;
      return '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" value="' + etiqueta.id + '" id="et-' + etiqueta.id + '"' +
          (marcada ? " checked" : "") + ">" +
        '<label class="form-check-label" for="et-' + etiqueta.id + '">' + etiqueta.nombre + "</label>" +
        "</div>";
    }).join("");
  }

  selectCategoria.addEventListener("change", function () {
    pintarEtiquetas([]);
  });

  if (existente) {
    document.querySelector("[data-bt-titulo-form]").textContent = "Editar producto";
    formulario.querySelector("#codigo").value = existente.codigo;
    formulario.querySelector("#nombre").value = existente.nombre;
    formulario.querySelector("#descripcion").value = existente.descripcion || "";
    formulario.querySelector("#precio").value = existente.precio;
    formulario.querySelector("#stock").value = existente.stock;
    formulario.querySelector("#stockCritico").value =
      existente.stockCritico === undefined ? "" : existente.stockCritico;
    formulario.querySelector("#imagen").value = existente.imagen || "";
    selectCategoria.value = existente.categoria;
    poblarSubcategorias(existente.categoria, existente.subcategoria);
    pintarEtiquetas(existente.etiquetas || []);
  } else {
    poblarSubcategorias("", null);
    pintarEtiquetas([]);
  }

  conectarFormulario(
    formulario,
    {
      codigo: function (valor) {
        const base = Validaciones.codigoProducto(valor);

        if (!base.valido) {
          return base;
        }

        if (RepoProductos.codigoDuplicado(valor.trim(), codigoOriginal)) {
          return { valido: false, mensaje: "Ya existe un producto con ese codigo." };
        }

        return base;
      },
      nombre: Validaciones.nombreProducto,
      descripcion: Validaciones.descripcion,
      precio: Validaciones.precio,
      stock: Validaciones.stock,
      stockCritico: Validaciones.stockCritico,
      categoria: function (valor) {
        return Validaciones.seleccion(valor, "una categoria");
      },
      subcategoria: function (valor) {
        return Validaciones.seleccion(valor, "una subcategoria");
      }
    },
    function () {
      const etiquetas = Array.from(
        contenedorEtiquetas.querySelectorAll("input:checked")
      ).map(function (casilla) {
        return casilla.value;
      });

      const stockCriticoCrudo = formulario.querySelector("#stockCritico").value;

      const producto = {
        codigo: formulario.querySelector("#codigo").value.trim(),
        nombre: formulario.querySelector("#nombre").value.trim(),
        descripcion: formulario.querySelector("#descripcion").value.trim(),
        precio: Number(formulario.querySelector("#precio").value),
        stock: Number(formulario.querySelector("#stock").value),
        categoria: selectCategoria.value,
        subcategoria: selectSubcategoria.value,
        etiquetas: etiquetas,
        destacado: existente ? existente.destacado === true : false,
        imagen: formulario.querySelector("#imagen").value.trim(),
        imagenes: existente ? existente.imagenes : []
      };

      if (stockCriticoCrudo.trim() !== "") {
        producto.stockCritico = Number(stockCriticoCrudo);
      }

      if (existente) {
        RepoProductos.actualizar(codigoOriginal, producto);
      } else {
        RepoProductos.crear(producto);
      }

      UI.notificar(existente ? "Producto actualizado." : "Producto creado.", "exito");
      window.setTimeout(function () {
        window.location.href = "productos.html";
      }, 900);
    }
  );
}

function iniciarFormularioUsuario() {
  const formulario = document.querySelector("#formUsuario");

  if (!formulario) {
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  const runOriginal = parametros.get("run");
  const existente = runOriginal ? RepoUsuarios.porRun(runOriginal) : null;

  const selectTipo = formulario.querySelector("#tipo");
  const selectRegion = formulario.querySelector("#region");
  const selectComuna = formulario.querySelector("#comuna");

  PERFILES.forEach(function (perfil) {
    selectTipo.appendChild(new Option(perfil.nombre, perfil.id));
  });

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

  if (existente) {
    document.querySelector("[data-bt-titulo-form]").textContent = "Editar usuario";
    formulario.querySelector("#run").value = existente.run;
    formulario.querySelector("#nombre").value = existente.nombre;
    formulario.querySelector("#apellidos").value = existente.apellidos;
    formulario.querySelector("#correo").value = existente.correo;
    formulario.querySelector("#fechaNacimiento").value = existente.fechaNacimiento || "";
    formulario.querySelector("#direccion").value = existente.direccion;
    selectTipo.value = existente.tipo;
    selectRegion.value = existente.region;
    poblarComunas(existente.region, existente.comuna);
  } else {
    poblarComunas("", null);
  }

  conectarFormulario(
    formulario,
    {
      run: function (valor) {
        const base = Validaciones.run(valor);

        if (!base.valido) {
          return base;
        }

        if (RepoUsuarios.duplicado("run", valor.trim().toUpperCase(), runOriginal)) {
          return { valido: false, mensaje: "Ya existe un usuario con ese RUN." };
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

        if (RepoUsuarios.duplicado("correo", valor.trim().toLowerCase(), runOriginal)) {
          return { valido: false, mensaje: "Ya existe un usuario con ese correo." };
        }

        return base;
      },
      fechaNacimiento: Validaciones.fechaNacimiento,
      tipo: function (valor) {
        return Validaciones.seleccion(valor, "un tipo de usuario");
      },
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
        fechaNacimiento: formulario.querySelector("#fechaNacimiento").value || null,
        tipo: selectTipo.value,
        region: selectRegion.value,
        comuna: selectComuna.value,
        direccion: formulario.querySelector("#direccion").value.trim()
      };

      if (existente) {
        RepoUsuarios.actualizar(runOriginal, usuario);
      } else {
        RepoUsuarios.crear(usuario);
      }

      UI.notificar(existente ? "Usuario actualizado." : "Usuario creado.", "exito");
      window.setTimeout(function () {
        window.location.href = "usuarios.html";
      }, 900);
    }
  );
}

function iniciarListadoOrdenes(sesion) {
  const cuerpo = document.querySelector("[data-bt-cuerpo-ordenes]");

  if (!cuerpo) {
    return;
  }

  const selectorEstado = document.querySelector("#filtroEstado");

  if (selectorEstado) {
    ESTADOS_ORDEN.forEach(function (estado) {
      selectorEstado.appendChild(new Option(estado.nombre, estado.id));
    });
  }

  crearTabla({
    cuerpo: cuerpo,
    columnas: 7,
    textoVacio: "Ninguna orden coincide con la busqueda.",
    ordenInicial: "fecha",
    encabezados: Array.from(document.querySelectorAll("[data-bt-orden]")),
    paginacion: document.querySelector("[data-bt-paginacion]"),
    info: document.querySelector("[data-bt-info-tabla]"),
    buscador: document.querySelector("#buscadorOrdenes"),
    selectorFiltro: selectorEstado,
    fuente: function () {
      return RepoOrdenes.todas();
    },
    valorOrden: function (orden, campo) {
      if (campo === "total") {
        return Number(orden.total);
      }
      if (campo === "items") {
        return itemsDeOrden(orden);
      }
      return orden[campo];
    },
    coincide: function (orden, busqueda, filtro) {
      if (filtro && orden.estado !== filtro) {
        return false;
      }

      if (!busqueda) {
        return true;
      }

      const texto = (orden.numero + " " + orden.clienteNombre + " " + orden.clienteCorreo).toLowerCase();
      return texto.indexOf(busqueda) !== -1;
    },
    fila: function (orden) {
      return "<tr>" +
        "<td>" + orden.numero + "</td>" +
        "<td>" + fechaLegible(orden.fecha) + "</td>" +
        "<td>" + orden.clienteNombre + "</td>" +
        '<td class="bt-num">' + itemsDeOrden(orden) + "</td>" +
        '<td class="bt-num">' + UI.formatearPrecio(orden.total) + "</td>" +
        '<td><span class="bt-estado bt-estado-' + orden.estado + '">' + nombreEstado(orden.estado) + "</span></td>" +
        '<td class="text-end"><a class="btn btn-sm btn-outline-primary" href="orden-detalle.html?numero=' +
          orden.numero + '">Ver detalle</a></td>' +
        "</tr>";
    },
    alPintar: function () {
      const resumen = document.querySelector("[data-bt-resumen-ventas]");

      if (!resumen) {
        return;
      }

      resumen.textContent = "Total vendido: " + UI.formatearPrecio(RepoOrdenes.totalVendido()) +
        " · " + RepoOrdenes.porDespachar().length + " por despachar";
    }
  }).pintar();
}

function iniciarDetalleOrden(sesion) {
  const contenedor = document.querySelector("[data-bt-detalle-orden]");

  if (!contenedor) {
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  const orden = RepoOrdenes.porNumero(parametros.get("numero"));

  if (!orden) {
    contenedor.classList.add("d-none");
    document.querySelector("[data-bt-orden-vacia]").classList.remove("d-none");
    return;
  }

  document.title = orden.numero + " | Administracion Botanik";
  document.querySelector("[data-bt-orden-numero]").textContent = orden.numero;
  document.querySelector("[data-bt-migaja-orden]").textContent = orden.numero;
  document.querySelector("[data-bt-orden-fecha]").textContent = fechaLegible(orden.fecha);
  document.querySelector("[data-bt-orden-cliente]").textContent = orden.clienteNombre;
  document.querySelector("[data-bt-orden-run]").textContent = orden.clienteRun;
  document.querySelector("[data-bt-orden-correo]").textContent = orden.clienteCorreo;
  document.querySelector("[data-bt-orden-direccion]").textContent = orden.direccion;
  document.querySelector("[data-bt-orden-comuna]").textContent =
    nombreComuna(orden.region, orden.comuna) + ", " + nombreRegion(orden.region);

  const marcaEstado = document.querySelector("[data-bt-orden-estado]");
  marcaEstado.textContent = nombreEstado(orden.estado);
  marcaEstado.className = "bt-estado bt-estado-" + orden.estado;

  document.querySelector("[data-bt-orden-lineas]").innerHTML = orden.lineas.map(function (linea) {
    const precio = linea.precio === 0
      ? '<span class="bt-precio-libre">Gratis</span>'
      : UI.formatearPrecio(linea.precio);

    return "<tr>" +
      "<td>" + linea.codigo + "</td>" +
      "<td>" + linea.nombre + "</td>" +
      '<td class="bt-num">' + precio + "</td>" +
      '<td class="bt-num">' + linea.cantidad + "</td>" +
      '<td class="bt-num">' + UI.formatearPrecio(linea.precio * linea.cantidad) + "</td>" +
      "</tr>";
  }).join("");

  document.querySelector("[data-bt-orden-subtotal]").textContent = UI.formatearPrecio(orden.subtotal);
  document.querySelector("[data-bt-orden-total]").textContent = UI.formatearPrecio(orden.total);

  const filaDescuento = document.querySelector("[data-bt-orden-fila-descuento]");
  filaDescuento.classList.toggle("d-none", orden.descuento === 0);

  if (orden.descuento > 0) {
    document.querySelector("[data-bt-orden-descuento]").textContent = "−" + UI.formatearPrecio(orden.descuento);
    document.querySelector("[data-bt-orden-cupon]").textContent = orden.cupon;
  }

  const panelEstado = document.querySelector("[data-bt-cambiar-estado]");

  if (sesion.tipo !== "administrador") {
    panelEstado.remove();
    return;
  }

  const selector = panelEstado.querySelector("#nuevoEstado");

  ESTADOS_ORDEN.forEach(function (estado) {
    selector.appendChild(new Option(estado.nombre, estado.id));
  });

  selector.value = orden.estado;

  panelEstado.querySelector("form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (selector.value === orden.estado) {
      UI.notificar("La orden ya esta en ese estado.", "aviso");
      return;
    }

    UI.confirmar(
      "La orden " + orden.numero + " pasara a " + nombreEstado(selector.value) + ".",
      { titulo: "Cambiar estado", textoAceptar: "Cambiar", claseAceptar: "btn-primary" }
    ).then(function (confirmado) {
      if (!confirmado) {
        return;
      }

      RepoOrdenes.cambiarEstado(orden.numero, selector.value);
      UI.notificar("Estado actualizado.", "exito");
      window.setTimeout(function () {
        window.location.reload();
      }, 700);
    });
  });
}

function conectarRestaurarDatos() {
  const boton = document.querySelector("[data-bt-restaurar]");

  if (!boton) {
    return;
  }

  boton.addEventListener("click", function () {
    UI.confirmar(
      "Se descartaran los cambios hechos en el administrador y el catalogo volvera al estado original de los archivos de datos.",
      { titulo: "Restaurar datos", textoAceptar: "Restaurar" }
    ).then(function (confirmado) {
      if (!confirmado) {
        return;
      }

      Almacen.borrar(CLAVES.productos);
      Almacen.borrar(CLAVES.usuarios);
      Almacen.borrar(CLAVES.ordenes);
      UI.notificar("Datos restaurados.", "exito");
      window.setTimeout(function () {
        window.location.reload();
      }, 700);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = Acceso.exigirSesion();

  if (!sesion) {
    return;
  }

  Acceso.aplicarPerfil(sesion);
  iniciarPanel(sesion);
  iniciarListadoProductos(sesion);
  iniciarListadoUsuarios();
  iniciarListadoOrdenes(sesion);
  iniciarDetalleOrden(sesion);
  iniciarFormularioProducto();
  iniciarFormularioUsuario();
  conectarRestaurarDatos();
});
