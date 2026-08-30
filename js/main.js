/**
 * Botanik — Comportamiento comun a todas las paginas.
 * Se carga en TODAS las vistas.
 *
 * El header, el nav y el footer estan escritos literalmente en cada HTML
 * (decision documentada en el README). Este archivo evita duplicar el
 * COMPORTAMIENTO de esos elementos.
 *
 * Responsabilidades:
 *  - Marcar el enlace del menu correspondiente a la pagina actual.
 *  - Leer el carrito desde localStorage y actualizar el contador del header.
 *  - Ajustar los enlaces visibles segun haya o no sesion iniciada.
 *  - Inicializar los tooltips de Bootstrap: NO se activan solos, hay que
 *    recorrer los elementos con data-bs-toggle="tooltip".
 *
 * Requiere bootstrap.bundle.min.js (incluye Popper). Sin el bundle, los
 * dropdowns y tooltips no funcionan y no se produce un error visible.
 */
