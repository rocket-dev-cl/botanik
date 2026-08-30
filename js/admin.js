/**
 * Botanik — Modulo de administracion.
 * Se carga en las vistas de admin/
 *
 * Responsabilidades:
 *  - Mantenedor de productos: listar, crear, editar y eliminar (R.14).
 *    La eliminacion pide confirmacion mediante ui.confirmar().
 *  - Marcar visualmente los productos con stock igual o inferior al
 *    stock critico definido (R.15).
 *  - Mantenedor de usuarios: listar, crear, editar y eliminar (R.16).
 *    No se permiten dos usuarios con el mismo RUN ni el mismo correo.
 *  - Ordenar los listados por columna y paginarlos (R.17).
 *    Con los datos en un arreglo: sort() y slice().
 *    El orden y los filtros se mantienen al cambiar de pagina.
 *  - Restringir las opciones visibles segun el perfil (R.18, R.24):
 *    las opciones ajenas al rol NO se muestran, no basta con deshabilitarlas.
 *
 * Perfiles:
 *   Administrador — acceso total
 *   Vendedor      — solo consulta de productos y ordenes
 *   Cliente       — no accede a este modulo
 */
