/**
 * Botanik — Formato de valores para mostrar.
 */

const FORMATO_CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

export function formatearPrecio(valor) {
  return FORMATO_CLP.format(Number(valor) || 0);
}

/* Los datos guardan las rutas sin barra inicial ("img/productos/pl-001.jpg").
   Con rutas anidadas como /producto/PL-001 una ruta relativa apuntaria a
   /producto/img/..., asi que se resuelve siempre desde la raiz del sitio. */
export function rutaImagen(ruta) {
  if (!ruta) {
    return "/img/ui/sin-imagen.svg";
  }

  return ruta.startsWith("/") || ruta.startsWith("http") ? ruta : "/" + ruta;
}

export function fechaLegible(iso) {
  if (!iso) {
    return "";
  }

  const [anio, mes, dia] = iso.split("-");
  return dia + "-" + mes + "-" + anio;
}
