/**
 * Botanik — Datos del cliente y direccion de entrega.
 *
 * En el checkout se completa; en la compra exitosa y en el pago fallido se
 * muestra igual pero de solo lectura. Un solo componente para las tres vistas.
 */

import CampoTexto from "./CampoTexto.jsx";
import SelectRegionComuna from "./SelectRegionComuna.jsx";

const NADA = () => {};

export default function FormularioEnvio({ valores, onChange = NADA, errores = {}, soloLectura = false }) {
  return (
    <>
      <h2 className="h4 mt-4">Informacion del cliente</h2>
      <p className="form-text mt-0">{soloLectura ? "Datos de la compra." : "Completa la siguiente informacion."}</p>
      <div className="row">
        <div className="col-12 col-md-6">
          <CampoTexto id="nombre" label="Nombre" obligatorio maxLength="50" value={valores.nombre} onChange={onChange} error={errores.nombre} readOnly={soloLectura} />
        </div>
        <div className="col-12 col-md-6">
          <CampoTexto id="apellidos" label="Apellidos" obligatorio maxLength="100" value={valores.apellidos} onChange={onChange} error={errores.apellidos} readOnly={soloLectura} />
        </div>
        <div className="col-12 col-md-6">
          <CampoTexto id="correo" label="Correo" type="email" obligatorio maxLength="100" value={valores.correo} onChange={onChange} error={errores.correo} readOnly={soloLectura} />
        </div>
      </div>

      <h2 className="h4 mt-3">Direccion de entrega de los productos</h2>
      <p className="form-text mt-0">Ingresa la direccion de forma detallada.</p>
      <div className="row">
        <div className="col-12 col-md-6">
          <CampoTexto id="calle" label="Calle y numero" obligatorio maxLength="250" value={valores.calle} onChange={onChange} error={errores.calle} readOnly={soloLectura} />
        </div>
        <div className="col-12 col-md-6">
          <CampoTexto id="departamento" label="Departamento (opcional)" maxLength="50" placeholder="Ej: 603" value={valores.departamento} onChange={onChange} readOnly={soloLectura} />
        </div>
      </div>
      <SelectRegionComuna region={valores.region} comuna={valores.comuna} onChange={onChange} errores={errores} deshabilitado={soloLectura} />
      <CampoTexto id="indicaciones" label="Indicaciones para la entrega (opcional)" como="textarea" rows="3" maxLength="300" placeholder="Ej: entre calles, color del edificio, no tiene timbre." value={valores.indicaciones} onChange={onChange} readOnly={soloLectura} />
    </>
  );
}
