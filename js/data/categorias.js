/**
 * Botanik — Taxonomia del catalogo.
 * Este archivo es la FUENTE DE VERDAD de categorias, subcategorias y etiquetas.
 *
 * REGLA QUE GOBIERNA EL MODELO
 *   La subcategoria responde "que es o donde va" el producto: es EXCLUYENTE,
 *   se elige una sola y se selecciona en un <select>.
 *   La etiqueta responde "como es": es MULTIPLE y alimenta los filtros.
 *
 *   Todo atributo que pueda ser verdadero al mismo tiempo que otro se modela
 *   como etiqueta, nunca como subcategoria. Por eso "autorriego" y "organico"
 *   son etiquetas: un macetero con autorriego tambien es de interior o de
 *   exterior, y un fertilizante puede ser liquido y organico a la vez.
 *
 * CRITERIO PARA AGREGAR UNA ETIQUETA
 *   Solo se justifica si divide el catalogo en grupos con contenido
 *   (referencia: entre 10% y 60% de los productos). Una etiqueta que cubre
 *   casi todo no filtra nada; una que cubre uno o dos es ruido.
 *   Por eso NO existe la etiqueta "decorativa": lo decorativo es el estado
 *   por defecto del catalogo. Se etiqueta la excepcion, no el caso normal.
 *
 * CONVENCION
 *   El valor va en minusculas, sin tildes y con guion (apta-mascotas).
 *   El texto visible se guarda aparte, igual que value vs contenido en <option>.
 */

const CATEGORIAS = [
  {
    id: "plantas",
    nombre: "Plantas",
    subcategorias: [
      { id: "interior", nombre: "Interior" },
      { id: "exterior", nombre: "Exterior" }
    ]
  },
  {
    id: "maceteros",
    nombre: "Maceteros",
    subcategorias: [
      { id: "interior", nombre: "Interior" },
      { id: "exterior", nombre: "Exterior" }
    ]
  },
  {
    id: "sustratos-fertilizantes",
    nombre: "Sustratos y fertilizantes",
    subcategorias: [
      { id: "sustratos", nombre: "Sustratos" },
      { id: "fertilizantes", nombre: "Fertilizantes" }
    ]
  },
  {
    id: "herramientas",
    nombre: "Herramientas",
    subcategorias: [
      { id: "poda", nombre: "Poda" },
      { id: "cultivo", nombre: "Cultivo" },
      { id: "riego", nombre: "Riego" }
    ]
  }
];

/**
 * Listado CERRADO de etiquetas. No se inventan etiquetas al cargar un
 * producto: primero se agregan aca y despues se usan.
 */
const ETIQUETAS = [
  // Plantas — tipo (que es)
  { id: "suculenta",     nombre: "Suculenta",          categoria: "plantas", eje: "tipo" },
  { id: "cactus",        nombre: "Cactus",             categoria: "plantas", eje: "tipo" },
  { id: "arbol",         nombre: "Árbol",              categoria: "plantas", eje: "tipo" },
  { id: "arbusto",       nombre: "Arbusto",            categoria: "plantas", eje: "tipo" },
  { id: "enredadera",    nombre: "Enredadera",         categoria: "plantas", eje: "tipo" },
  { id: "colgante",      nombre: "Colgante",           categoria: "plantas", eje: "tipo" },
  { id: "con-flor",      nombre: "Con flor",           categoria: "plantas", eje: "tipo" },

  // Plantas — uso (para que)
  { id: "aromatica",     nombre: "Aromática",          categoria: "plantas", eje: "uso" },
  { id: "comestible",    nombre: "Comestible",         categoria: "plantas", eje: "uso" },

  // Plantas — cuidado
  { id: "poca-luz",      nombre: "Tolera poca luz",    categoria: "plantas", eje: "cuidado" },
  { id: "pleno-sol",     nombre: "Pleno sol",          categoria: "plantas", eje: "cuidado" },
  { id: "bajo-riego",    nombre: "Bajo riego",         categoria: "plantas", eje: "cuidado" },

  // Plantas — beneficio
  { id: "apta-mascotas", nombre: "Apta para mascotas", categoria: "plantas", eje: "beneficio" },
  { id: "purificadora",  nombre: "Purifica el aire",   categoria: "plantas", eje: "beneficio" },

  // Maceteros
  { id: "autorriego",    nombre: "Autorriego",         categoria: "maceteros", eje: "caracteristica" },
  { id: "ceramica",      nombre: "Cerámica",           categoria: "maceteros", eje: "material" },
  { id: "plastico",      nombre: "Plástico",           categoria: "maceteros", eje: "material" },
  { id: "fibra",         nombre: "Fibra",              categoria: "maceteros", eje: "material" },

  // Sustratos y fertilizantes
  { id: "universal",         nombre: "Universal",             categoria: "sustratos-fertilizantes", eje: "uso" },
  { id: "cactus-suculentas", nombre: "Cactus y suculentas",   categoria: "sustratos-fertilizantes", eje: "uso" },
  { id: "liquido",           nombre: "Líquido",               categoria: "sustratos-fertilizantes", eje: "formato" },
  { id: "solido",            nombre: "Sólido",                categoria: "sustratos-fertilizantes", eje: "formato" },
  { id: "organico",          nombre: "Orgánico",              categoria: "sustratos-fertilizantes", eje: "origen" }
];
