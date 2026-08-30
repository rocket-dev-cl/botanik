/**
 * Botanik — Carrito de compras.
 * Se carga en: productos.html, detalle-producto.html, carrito.html
 *
 * Responsabilidades:
 *  - Agregar productos desde la grilla y desde el detalle (R.5).
 *    Agregar dos veces el mismo producto SUMA cantidad, no crea otra linea.
 *  - Modificar cantidades y eliminar lineas, recalculando el total (R.6).
 *    La cantidad no baja de 1.
 *  - Persistir el contenido en localStorage y restaurarlo al volver (R.7).
 *    Si los datos guardados no se pueden interpretar, iniciar con el carrito
 *    vacio en vez de interrumpir el funcionamiento (R.27).
 *  - Aplicar cupon de descuento sobre el total; informar si el codigo no
 *    existe; no permitir aplicar dos veces el mismo cupon (R.8).
 *
 * El total mostrado debe corresponder siempre a la suma de las lineas.
 */
