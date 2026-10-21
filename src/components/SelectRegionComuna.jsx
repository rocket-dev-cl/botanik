/**
 * Botanik — Selects encadenados de region y comuna.
 *
 * La comuna queda deshabilitada hasta elegir region, y al cambiar de region se
 * limpia la comuna elegida: una comuna de otra region seria un dato invalido.
 * Region y comuna se guardan como id, no como nombre.
 */

import { db } from "../services/db.js";

export default function SelectRegionComuna({ region, comuna, onChange, errores = {}, deshabilitado = false }) {
  const regiones = db.getRegiones();
  const comunas = db.getComunas(region);

  function cambiarRegion(evento) {
    onChange("region", evento.target.value);
    onChange("comuna", "");
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6 mb-3">
        <label className="form-label" htmlFor="region">Region<span className="bt-obligatorio" aria-hidden="true"> *</span></label>
        <select className={"form-select" + (errores.region ? " is-invalid" : "")} id="region" value={region} onChange={cambiarRegion} disabled={deshabilitado}>
          <option value="">Selecciona una region</option>
          {regiones.map((item) => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
        {errores.region && <div className="invalid-feedback d-block">{errores.region}</div>}
      </div>
      <div className="col-12 col-md-6 mb-3">
        <label className="form-label" htmlFor="comuna">Comuna<span className="bt-obligatorio" aria-hidden="true"> *</span></label>
        <select className={"form-select" + (errores.comuna ? " is-invalid" : "")} id="comuna" value={comuna} onChange={(evento) => onChange("comuna", evento.target.value)} disabled={deshabilitado || region === ""}>
          <option value="">{region === "" ? "Primero elige la region" : "Selecciona una comuna"}</option>
          {comunas.map((item) => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
        {errores.comuna && <div className="invalid-feedback d-block">{errores.comuna}</div>}
      </div>
    </div>
  );
}
