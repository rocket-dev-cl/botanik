/**
 * Botanik — Campo de formulario con su etiqueta y su mensaje de error.
 *
 * No guarda estado propio: el valor y el error los decide el formulario que lo
 * usa y llegan por props. Asi un mismo campo sirve en login, registro,
 * checkout y en los mantenedores del administrador.
 */

export default function CampoTexto({
  id,
  label,
  value,
  onChange,
  error = "",
  type = "text",
  obligatorio = false,
  como = "input",
  ayuda = "",
  ...resto
}) {
  const clase = "form-control" + (error ? " is-invalid" : "");
  const Control = como === "textarea" ? "textarea" : "input";

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
        {obligatorio && <span className="bt-obligatorio" aria-hidden="true"> *</span>}
      </label>
      <Control
        className={clase}
        id={id}
        name={id}
        type={como === "textarea" ? undefined : type}
        value={value}
        onChange={(evento) => onChange(id, evento.target.value)}
        aria-invalid={error ? "true" : undefined}
        {...resto}
      />
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
