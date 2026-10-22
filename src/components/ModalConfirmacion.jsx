/**
 * Botanik — Ventana de confirmacion.
 *
 * Reemplaza a confirm() del navegador. El componente no decide nada: se abre
 * cuando el padre pone abierto={true} y le avisa la respuesta por onAceptar u
 * onCancelar. Usa el marcado del modal de Bootstrap, mostrado por React.
 */

export default function ModalConfirmacion({
  abierto,
  titulo = "Confirmar",
  mensaje,
  textoAceptar = "Confirmar",
  onAceptar,
  onCancelar
}) {
  if (!abierto) {
    return null;
  }

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="tituloConfirmacion">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="tituloConfirmacion">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={onAceptar}>{textoAceptar}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
