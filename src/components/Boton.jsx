/**
 * Botanik — Boton reutilizable.
 *
 * Recibe por props el texto (etiqueta), la funcion que se ejecuta al hacer clic
 * (onClick) y el estilo de Bootstrap (variante). No tiene estado propio: solo
 * muestra lo que le pasan y avisa del clic a quien lo usa.
 */

export default function Boton({
  etiqueta,
  onClick,
  variante = "primary",
  tipo = "button",
  deshabilitado = false,
  className = "",
  ...resto
}) {
  return (
    <button
      type={tipo}
      className={("btn btn-" + variante + " " + className).trim()}
      onClick={onClick}
      disabled={deshabilitado}
      {...resto}
    >
      {etiqueta}
    </button>
  );
}
