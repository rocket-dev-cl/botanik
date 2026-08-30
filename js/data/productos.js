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
 *     imagen:       "img/productos/", // opcional
 *     imagenes:     []               // opcional, galeria del detalle
 *   }
 *
 * TODO: cargar al menos 12 productos para que la grilla y los filtros se vean
 * con contenido real.
 */

const PRODUCTOS = [
];
