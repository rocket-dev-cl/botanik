/**
 * Botanik — Catalogo de productos.
 * Solo datos, sin logica: actualizar el catalogo no debe obligar a tocar codigo.
 *
 * Esquema de cada producto:
 *
 *   {
 *     codigo:       "PL-001",        // requerido, texto, min 3, unico
 *     nombre:       "",              // requerido, max 100
 *     descripcion:  "",              // opcional, max 500
 *     precio:       0,               // requerido, min 0 (0 = producto FREE), admite decimales
 *     stock:        0,               // requerido, entero, min 0
 *     stockCritico: 0,               // opcional, entero, min 0
 *     categoria:    "plantas",       // requerido, id de CATEGORIAS
 *     subcategoria: "interior",      // requerido, id dentro de esa categoria
 *     etiquetas:    ["suculenta"],   // multiples, ids de ETIQUETAS
 *     destacado:    false,           // aparece en la grilla del Home
 *     imagen:       "img/productos/", // opcional
 *     imagenes:     []               // opcional, galeria del detalle
 *   }
 *
 * CAMPO AGREGADO AL ESQUEMA: destacado
 *   El Home pide una grilla de 8 productos destacados. Se resolvio con una
 *   marca en el dato y no tomando los 8 primeros del arreglo, porque atar el
 *   destacado a la posicion significa que reordenar el catalogo cambia la
 *   portada sin que nadie lo haya pedido. Son exactamente 8 en true.
 *
 * CONVENCION DEL CODIGO
 *   Dos letras de familia mas correlativo: PL plantas, MC maceteros,
 *   SF sustratos y fertilizantes, HR herramientas. Cumple el minimo de 3
 *   caracteres exigido por la validacion y hace legible el listado del
 *   administrador sin abrir cada ficha.
 *
 * NOMBRE DE LAS IMAGENES
 *   El archivo se llama igual que el codigo en minusculas: PL-001 va en
 *   img/productos/pl-001.jpg. Nadie tiene que decidir un nombre al cargar una
 *   foto y no hay forma de que la imagen quede huerfana de su producto.
 *   Las miniaturas de la galeria agregan sufijo: pl-001-2.jpg, pl-001-3.jpg.
 *   El listado completo de archivos por conseguir esta en docs/imagenes.md.
 *
 * CASOS DE PRUEBA SEMBRADOS EN EL CATALOGO
 *   - PL-023 tiene precio 0: ejercita la regla de producto FREE.
 *   - PL-004, MC-005 y SF-005 tienen stock igual o menor a su stock critico:
 *     ejercitan la alerta de R.15 sin necesidad de editar datos para probarla.
 *   - SF-005 ademas tiene stock 0: agotado, que no es lo mismo que critico.
 *   - HR-001 a HR-008 no llevan etiquetas: la grilla y los filtros tienen que
 *     comportarse bien con el arreglo vacio.
 */

const PRODUCTOS = [
  // ---------------------------------------------------------------- Plantas
  {
    codigo: "PL-001",
    nombre: "Monstera deliciosa",
    descripcion: "La planta de interior mas reconocible. Sus hojas se abren en cortes a medida que madura, y por eso pide un espacio donde pueda crecer hacia los lados. Tolera luz indirecta y agradece un riego cuando los primeros centimetros de sustrato ya estan secos.",
    precio: 24990,
    stock: 18,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["poca-luz", "purificadora"],
    destacado: true,
    imagen: "img/productos/pl-001.jpg",
    imagenes: ["img/productos/pl-001.jpg", "img/productos/pl-001-2.jpg", "img/productos/pl-001-3.jpg"]
  },
  {
    codigo: "PL-002",
    nombre: "Potus",
    descripcion: "Enredadera de interior que crece colgando o trepando, segun donde se la ponga. Es la planta con la que suele empezar quien nunca tuvo una: perdona el olvido de riegos y avisa con las hojas cuando le falta agua.",
    precio: 8990,
    stock: 42,
    stockCritico: 10,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["colgante", "poca-luz", "purificadora"],
    destacado: true,
    imagen: "img/productos/pl-002.jpg",
    imagenes: ["img/productos/pl-002.jpg", "img/productos/pl-002-2.jpg", "img/productos/pl-002-3.jpg"]
  },
  {
    codigo: "PL-003",
    nombre: "Sansevieria Laurentii",
    descripcion: "Hojas verticales de borde amarillo. Resiste condiciones que otras plantas no toleran: poca luz, aire seco y riegos espaciados. Una de las pocas que puede pasar tres semanas sola sin consecuencias.",
    precio: 15990,
    stock: 25,
    stockCritico: 6,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["poca-luz", "purificadora", "bajo-riego"],
    destacado: true,
    imagen: "img/productos/pl-003.jpg",
    imagenes: ["img/productos/pl-003.jpg", "img/productos/pl-003-2.jpg", "img/productos/pl-003-3.jpg"]
  },
  {
    codigo: "PL-004",
    nombre: "Ficus lyrata",
    descripcion: "Arbol de interior de hojas grandes en forma de violin. Es exigente: quiere luz abundante pero indirecta y no le gusta que la muevan de lugar una vez que se acostumbro.",
    precio: 34990,
    stock: 3,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["arbol", "purificadora"],
    destacado: false,
    imagen: "img/productos/pl-004.jpg",
    imagenes: []
  },
  {
    codigo: "PL-005",
    nombre: "Calathea orbifolia",
    descripcion: "Hojas anchas con vetas plateadas que se pliegan de noche y vuelven a abrirse de dia. Pide humedad ambiental, asi que se lleva bien con cocinas y banos con luz.",
    precio: 19990,
    stock: 12,
    stockCritico: 4,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["poca-luz", "apta-mascotas"],
    destacado: false,
    imagen: "img/productos/pl-005.jpg",
    imagenes: []
  },
  {
    codigo: "PL-006",
    nombre: "Zamioculca",
    descripcion: "Follaje brillante y tallos gruesos que almacenan agua. Sobrevive en oficinas con luz artificial y riego irregular, que es exactamente donde mueren casi todas las demas.",
    precio: 17990,
    stock: 20,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["poca-luz", "bajo-riego"],
    destacado: false,
    imagen: "img/productos/pl-006.jpg",
    imagenes: []
  },
  {
    codigo: "PL-007",
    nombre: "Helecho espada",
    descripcion: "Clasico de terrazas techadas y banos con ventana. Crece en volumen y luce mejor colgado, donde las frondas caen libres. Necesita humedad constante en el sustrato.",
    precio: 7990,
    stock: 30,
    stockCritico: 8,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["colgante", "apta-mascotas", "purificadora"],
    destacado: false,
    imagen: "img/productos/pl-007.jpg",
    imagenes: []
  },
  {
    codigo: "PL-008",
    nombre: "Palma areca",
    descripcion: "Palma de interior que aporta altura sin ocupar mucho suelo. Es de las mas eficientes filtrando el aire de espacios cerrados y no representa riesgo para gatos ni perros.",
    precio: 27990,
    stock: 9,
    stockCritico: 4,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["purificadora", "apta-mascotas"],
    destacado: false,
    imagen: "img/productos/pl-008.jpg",
    imagenes: []
  },
  {
    codigo: "PL-009",
    nombre: "Echeveria",
    descripcion: "Suculenta en roseta, de hojas carnosas y tono azulado. Quiere sol directo y muy poca agua: el error mas comun es regarla de mas.",
    precio: 3990,
    stock: 60,
    stockCritico: 15,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["suculenta", "bajo-riego", "pleno-sol"],
    destacado: true,
    imagen: "img/productos/pl-009.jpg",
    imagenes: ["img/productos/pl-009.jpg", "img/productos/pl-009-2.jpg", "img/productos/pl-009-3.jpg"]
  },
  {
    codigo: "PL-010",
    nombre: "Cactus Mammillaria",
    descripcion: "Cactus globular de espinas finas que florece en corona durante la primavera. Riego cada tres semanas en verano y practicamente nulo en invierno.",
    precio: 4490,
    stock: 45,
    stockCritico: 12,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["cactus", "bajo-riego", "pleno-sol", "con-flor"],
    destacado: false,
    imagen: "img/productos/pl-010.jpg",
    imagenes: []
  },
  {
    codigo: "PL-011",
    nombre: "Peperomia sandia",
    descripcion: "Planta pequena de hojas redondas con un dibujo que recuerda la cascara de una sandia. Ideal para escritorios y repisas: no supera los 30 centimetros.",
    precio: 9990,
    stock: 22,
    stockCritico: 6,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["apta-mascotas", "poca-luz"],
    destacado: false,
    imagen: "img/productos/pl-011.jpg",
    imagenes: []
  },
  {
    codigo: "PL-012",
    nombre: "Set de 6 suculentas surtidas",
    descripcion: "Seis suculentas distintas en maceta de 5 centimetros. La combinacion varia segun disponibilidad de vivero. Pensado para armar una repisa completa de una sola vez o para regalar.",
    precio: 14990,
    stock: 15,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "interior",
    etiquetas: ["suculenta", "bajo-riego", "pleno-sol"],
    destacado: false,
    imagen: "img/productos/pl-012.jpg",
    imagenes: []
  },
  {
    codigo: "PL-013",
    nombre: "Lavanda",
    descripcion: "Arbusto aromatico de flores moradas que atrae polinizadores y aguanta el verano sin sombra. Se poda despues de la floracion para que no se abra por el centro.",
    precio: 6990,
    stock: 35,
    stockCritico: 10,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["arbusto", "aromatica", "pleno-sol", "bajo-riego", "con-flor"],
    destacado: true,
    imagen: "img/productos/pl-013.jpg",
    imagenes: ["img/productos/pl-013.jpg", "img/productos/pl-013-2.jpg", "img/productos/pl-013-3.jpg"]
  },
  {
    codigo: "PL-014",
    nombre: "Romero",
    descripcion: "Aromatica perenne de uso en cocina. Crece en maceta o en tierra, resiste sequia y mejora si se le corta seguido. Pide sol directo la mayor parte del dia.",
    precio: 5490,
    stock: 40,
    stockCritico: 10,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["aromatica", "comestible", "pleno-sol", "bajo-riego"],
    destacado: false,
    imagen: "img/productos/pl-014.jpg",
    imagenes: []
  },
  {
    codigo: "PL-015",
    nombre: "Albahaca",
    descripcion: "Anual de crecimiento rapido para maceta de balcon. Se cosecha por arriba para que ramifique y no se vaya a flor. Riego frecuente y sol de manana.",
    precio: 3490,
    stock: 50,
    stockCritico: 12,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["aromatica", "comestible", "pleno-sol"],
    destacado: false,
    imagen: "img/productos/pl-015.jpg",
    imagenes: []
  },
  {
    codigo: "PL-016",
    nombre: "Menta",
    descripcion: "Crece con una facilidad que se vuelve problema: conviene mantenerla en maceta propia, porque en tierra libre invade el resto del cantero.",
    precio: 3490,
    stock: 38,
    stockCritico: 10,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["aromatica", "comestible"],
    destacado: false,
    imagen: "img/productos/pl-016.jpg",
    imagenes: []
  },
  {
    codigo: "PL-017",
    nombre: "Hortensia",
    descripcion: "Arbusto de flor voluminosa para patios con sombra parcial. El color de la flor depende de la acidez del suelo, asi que se puede virar hacia el azul o el rosado con el sustrato adecuado.",
    precio: 12990,
    stock: 16,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["arbusto", "con-flor"],
    destacado: false,
    imagen: "img/productos/pl-017.jpg",
    imagenes: []
  },
  {
    codigo: "PL-018",
    nombre: "Jazmin chileno",
    descripcion: "Enredadera de flor blanca y perfume intenso al atardecer. Cubre rejas y pergolas en un par de temporadas si tiene donde agarrarse.",
    precio: 14990,
    stock: 14,
    stockCritico: 4,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["enredadera", "aromatica", "con-flor"],
    destacado: false,
    imagen: "img/productos/pl-018.jpg",
    imagenes: []
  },
  {
    codigo: "PL-019",
    nombre: "Olivo",
    descripcion: "Arbol de hoja perenne y porte mediterraneo. Aguanta veranos secos y suelos pobres. En maceta grande se mantiene controlado y sirve como pieza central de una terraza.",
    precio: 45990,
    stock: 7,
    stockCritico: 3,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["arbol", "pleno-sol", "bajo-riego"],
    destacado: false,
    imagen: "img/productos/pl-019.jpg",
    imagenes: []
  },
  {
    codigo: "PL-020",
    nombre: "Limonero de cuatro estaciones",
    descripcion: "Citrico injertado que da fruta durante buena parte del ano. Necesita sol pleno, maceta profunda y fertilizacion regular en temporada de crecimiento.",
    precio: 29990,
    stock: 11,
    stockCritico: 4,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["arbol", "comestible", "pleno-sol", "con-flor"],
    destacado: false,
    imagen: "img/productos/pl-020.jpg",
    imagenes: []
  },
  {
    codigo: "PL-021",
    nombre: "Buganvilia",
    descripcion: "Trepadora de bracteas intensas que florece con calor y poca agua. Mientras menos se la mima, mas flor da.",
    precio: 13990,
    stock: 19,
    stockCritico: 5,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["enredadera", "con-flor", "pleno-sol", "bajo-riego"],
    destacado: false,
    imagen: "img/productos/pl-021.jpg",
    imagenes: []
  },
  {
    codigo: "PL-022",
    nombre: "Aloe vera",
    descripcion: "Suculenta de hojas gruesas con gel interior. Vive en exterior con sol directo y riego escaso; en invierno conviene protegerla de heladas fuertes.",
    precio: 6490,
    stock: 28,
    stockCritico: 8,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["suculenta", "bajo-riego", "pleno-sol"],
    destacado: false,
    imagen: "img/productos/pl-022.jpg",
    imagenes: []
  },
  {
    codigo: "PL-023",
    nombre: "Sobre de semillas de albahaca",
    descripcion: "Sobre de aproximadamente 50 semillas. Va de regalo con cualquier compra y tambien se puede pedir solo. Siembra de primavera a inicios de verano, en sustrato universal y a un centimetro de profundidad.",
    precio: 0,
    stock: 200,
    stockCritico: 30,
    categoria: "plantas",
    subcategoria: "exterior",
    etiquetas: ["aromatica", "comestible"],
    destacado: false,
    imagen: "img/productos/pl-023.jpg",
    imagenes: []
  },

  // -------------------------------------------------------------- Maceteros
  {
    codigo: "MC-001",
    nombre: "Macetero de ceramica mate 14 cm",
    descripcion: "Ceramica esmaltada en acabado mate, con orificio de drenaje y plato incluido. Diametro 14 cm, alto 13 cm. Para plantas de interior de porte pequeno.",
    precio: 8990,
    stock: 34,
    stockCritico: 8,
    categoria: "maceteros",
    subcategoria: "interior",
    etiquetas: ["ceramica"],
    destacado: false,
    imagen: "img/productos/mc-001.jpg",
    imagenes: []
  },
  {
    codigo: "MC-002",
    nombre: "Macetero de ceramica 20 cm con plato",
    descripcion: "Version mayor del anterior, para plantas que ya necesitan trasplante. Diametro 20 cm, alto 19 cm. Pesa lo suficiente para no volcarse con una planta alta.",
    precio: 13990,
    stock: 21,
    stockCritico: 6,
    categoria: "maceteros",
    subcategoria: "interior",
    etiquetas: ["ceramica"],
    destacado: true,
    imagen: "img/productos/mc-002.jpg",
    imagenes: ["img/productos/mc-002.jpg", "img/productos/mc-002-2.jpg", "img/productos/mc-002-3.jpg"]
  },
  {
    codigo: "MC-003",
    nombre: "Macetero con autorriego 16 cm",
    descripcion: "Deposito inferior con indicador de nivel: la planta toma el agua por capilaridad y el riego pasa a ser quincenal. Resuelve viajes y semanas complicadas.",
    precio: 11990,
    stock: 26,
    stockCritico: 7,
    categoria: "maceteros",
    subcategoria: "interior",
    etiquetas: ["autorriego", "plastico"],
    destacado: false,
    imagen: "img/productos/mc-003.jpg",
    imagenes: []
  },
  {
    codigo: "MC-004",
    nombre: "Macetero colgante de fibra 18 cm",
    descripcion: "Fibra natural trenzada con cuerda de suspension de 80 cm. Liviano, pensado para potus, helechos y cualquier planta que caiga.",
    precio: 10990,
    stock: 17,
    stockCritico: 5,
    categoria: "maceteros",
    subcategoria: "interior",
    etiquetas: ["fibra"],
    destacado: false,
    imagen: "img/productos/mc-004.jpg",
    imagenes: []
  },
  {
    codigo: "MC-005",
    nombre: "Macetero de fibrocemento 30 cm",
    descripcion: "Acabado tipo concreto para exterior, resistente a heladas y radiacion. Diametro 30 cm. Estable con arbustos y arboles jovenes.",
    precio: 24990,
    stock: 4,
    stockCritico: 4,
    categoria: "maceteros",
    subcategoria: "exterior",
    etiquetas: ["fibra"],
    destacado: false,
    imagen: "img/productos/mc-005.jpg",
    imagenes: []
  },
  {
    codigo: "MC-006",
    nombre: "Macetero plastico 25 cm",
    descripcion: "Plastico reciclado con tratamiento contra rayos UV, para que no se decolore ni se vuelva quebradizo al sol. Drenaje en la base.",
    precio: 4990,
    stock: 55,
    stockCritico: 15,
    categoria: "maceteros",
    subcategoria: "exterior",
    etiquetas: ["plastico"],
    destacado: false,
    imagen: "img/productos/mc-006.jpg",
    imagenes: []
  },
  {
    codigo: "MC-007",
    nombre: "Jardinera plastica 60 cm",
    descripcion: "Jardinera rectangular para barandas y bordes de terraza. Largo 60 cm. Admite tres o cuatro aromaticas en linea.",
    precio: 9990,
    stock: 23,
    stockCritico: 6,
    categoria: "maceteros",
    subcategoria: "exterior",
    etiquetas: ["plastico"],
    destacado: false,
    imagen: "img/productos/mc-007.jpg",
    imagenes: []
  },
  {
    codigo: "MC-008",
    nombre: "Macetero con autorriego exterior 30 cm",
    descripcion: "Deposito de dos litros y rebalse lateral para que la lluvia no ahogue la raiz. Para plantas de terraza que reciben sol todo el dia.",
    precio: 18990,
    stock: 13,
    stockCritico: 4,
    categoria: "maceteros",
    subcategoria: "exterior",
    etiquetas: ["autorriego", "plastico"],
    destacado: false,
    imagen: "img/productos/mc-008.jpg",
    imagenes: []
  },

  // ------------------------------------------- Sustratos y fertilizantes
  {
    codigo: "SF-001",
    nombre: "Sustrato universal 5 L",
    descripcion: "Mezcla de turba, compost y perlita para trasplante general de interior y exterior. Retiene humedad sin compactarse.",
    precio: 4990,
    stock: 70,
    stockCritico: 20,
    categoria: "sustratos-fertilizantes",
    subcategoria: "sustratos",
    etiquetas: ["universal", "solido"],
    destacado: true,
    imagen: "img/productos/sf-001.jpg",
    imagenes: ["img/productos/sf-001.jpg", "img/productos/sf-001-2.jpg", "img/productos/sf-001-3.jpg"]
  },
  {
    codigo: "SF-002",
    nombre: "Sustrato para cactus y suculentas 3 L",
    descripcion: "Mezcla arenosa de drenaje rapido. Evita el encharcamiento, que es la causa mas frecuente de muerte en estas especies.",
    precio: 3990,
    stock: 48,
    stockCritico: 12,
    categoria: "sustratos-fertilizantes",
    subcategoria: "sustratos",
    etiquetas: ["cactus-suculentas", "solido"],
    destacado: false,
    imagen: "img/productos/sf-002.jpg",
    imagenes: []
  },
  {
    codigo: "SF-003",
    nombre: "Humus de lombriz 4 L",
    descripcion: "Abono organico de liberacion lenta. Se mezcla con el sustrato al trasplantar o se aplica en superficie una vez al mes.",
    precio: 5990,
    stock: 44,
    stockCritico: 12,
    categoria: "sustratos-fertilizantes",
    subcategoria: "sustratos",
    etiquetas: ["organico", "solido", "universal"],
    destacado: false,
    imagen: "img/productos/sf-003.jpg",
    imagenes: []
  },
  {
    codigo: "SF-004",
    nombre: "Perlita 2 L",
    descripcion: "Mineral expandido que se agrega al sustrato para airearlo. Un 20 por ciento de perlita cambia por completo el drenaje de una mezcla pesada.",
    precio: 3490,
    stock: 52,
    stockCritico: 15,
    categoria: "sustratos-fertilizantes",
    subcategoria: "sustratos",
    etiquetas: ["solido", "universal"],
    destacado: false,
    imagen: "img/productos/sf-004.jpg",
    imagenes: []
  },
  {
    codigo: "SF-005",
    nombre: "Fertilizante liquido universal 250 ml",
    descripcion: "Concentrado que se diluye en el agua de riego. Una tapa cada quince dias durante primavera y verano; se suspende en invierno.",
    precio: 6990,
    stock: 0,
    stockCritico: 8,
    categoria: "sustratos-fertilizantes",
    subcategoria: "fertilizantes",
    etiquetas: ["liquido", "universal"],
    destacado: false,
    imagen: "img/productos/sf-005.jpg",
    imagenes: []
  },
  {
    codigo: "SF-006",
    nombre: "Fertilizante organico solido 1 kg",
    descripcion: "Granulado de origen vegetal y animal, sin sintesis quimica. Se esparce sobre el sustrato y se riega para que baje a la raiz.",
    precio: 7990,
    stock: 31,
    stockCritico: 8,
    categoria: "sustratos-fertilizantes",
    subcategoria: "fertilizantes",
    etiquetas: ["organico", "solido"],
    destacado: false,
    imagen: "img/productos/sf-006.jpg",
    imagenes: []
  },
  {
    codigo: "SF-007",
    nombre: "Fertilizante para plantas con flor 250 ml",
    descripcion: "Formula alta en fosforo y potasio, que es lo que empuja la floracion. Para hortensias, buganvilias, lavandas y citricos en temporada.",
    precio: 6490,
    stock: 27,
    stockCritico: 8,
    categoria: "sustratos-fertilizantes",
    subcategoria: "fertilizantes",
    etiquetas: ["liquido"],
    destacado: false,
    imagen: "img/productos/sf-007.jpg",
    imagenes: []
  },

  // ------------------------------------------------------------ Herramientas
  {
    codigo: "HR-001",
    nombre: "Tijera de podar",
    descripcion: "Hoja de acero al carbono con mango antideslizante y seguro de cierre. Corta ramas de hasta 18 milimetros.",
    precio: 12990,
    stock: 24,
    stockCritico: 6,
    categoria: "herramientas",
    subcategoria: "poda",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-001.jpg",
    imagenes: []
  },
  {
    codigo: "HR-002",
    nombre: "Tijera de precision",
    descripcion: "Punta fina para trabajo de detalle: bonsai, esquejes y limpieza de hojas secas en plantas pequenas.",
    precio: 8990,
    stock: 29,
    stockCritico: 8,
    categoria: "herramientas",
    subcategoria: "poda",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-002.jpg",
    imagenes: []
  },
  {
    codigo: "HR-003",
    nombre: "Set de trasplante 3 piezas",
    descripcion: "Pala ancha, pala angosta y rastrillo de mano, en aluminio con mango de madera. Cubre todo lo necesario para un trasplante en maceta.",
    precio: 9990,
    stock: 20,
    stockCritico: 5,
    categoria: "herramientas",
    subcategoria: "cultivo",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-003.jpg",
    imagenes: []
  },
  {
    codigo: "HR-004",
    nombre: "Guantes de jardineria",
    descripcion: "Palma recubierta en latex y dorso de tela respirable. Talla unica ajustable en la muneca.",
    precio: 5990,
    stock: 41,
    stockCritico: 10,
    categoria: "herramientas",
    subcategoria: "cultivo",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-004.jpg",
    imagenes: []
  },
  {
    codigo: "HR-005",
    nombre: "Regadera metalica 1,5 L",
    descripcion: "Pico largo y estrecho para regar en la base sin mojar las hojas, que es lo que evita hongos en plantas de interior.",
    precio: 11990,
    stock: 18,
    stockCritico: 5,
    categoria: "herramientas",
    subcategoria: "riego",
    etiquetas: [],
    destacado: true,
    imagen: "img/productos/hr-005.jpg",
    imagenes: ["img/productos/hr-005.jpg", "img/productos/hr-005-2.jpg", "img/productos/hr-005-3.jpg"]
  },
  {
    codigo: "HR-006",
    nombre: "Pulverizador 500 ml",
    descripcion: "Gatillo de niebla fina para subir la humedad de calatheas, helechos y demas especies tropicales.",
    precio: 4490,
    stock: 47,
    stockCritico: 12,
    categoria: "herramientas",
    subcategoria: "riego",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-006.jpg",
    imagenes: []
  },
  {
    codigo: "HR-007",
    nombre: "Kit de riego por goteo",
    descripcion: "Quince metros de manguera, veinte goteros regulables y conectores. Para automatizar el riego de una terraza mediana.",
    precio: 19990,
    stock: 10,
    stockCritico: 3,
    categoria: "herramientas",
    subcategoria: "riego",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-007.jpg",
    imagenes: []
  },
  {
    codigo: "HR-008",
    nombre: "Medidor de humedad de sustrato",
    descripcion: "Sonda sin pilas que indica si la tierra esta seca, humeda o encharcada. Responde la unica pregunta que importa antes de regar.",
    precio: 7490,
    stock: 33,
    stockCritico: 8,
    categoria: "herramientas",
    subcategoria: "cultivo",
    etiquetas: [],
    destacado: false,
    imagen: "img/productos/hr-008.jpg",
    imagenes: []
  }
];
