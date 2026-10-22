/**
 * Botanik — Filtros del catalogo.
 *
 * Es un componente controlado: no guarda los filtros elegidos, los recibe en
 * la prop "filtros" y avisa cada cambio con onChange. El estado vive en la
 * pagina Productos, que es la que filtra la grilla.
 *
 * La subcategoria queda deshabilitada hasta elegir categoria, y las etiquetas
 * visibles dependen de la categoria: mostrar todas llenaria la vista de
 * filtros que no devuelven nada.
 */

import { db } from "../services/db.js";

export default function Filtros({ filtros, onChange, onLimpiar }) {
  const categorias = db.getCategorias();
  const categoria = categorias.find((item) => item.id === filtros.categoria);
  const subcategorias = categoria ? categoria.subcategorias : [];
  const etiquetas = db.getEtiquetas().filter((etiqueta) =>
    filtros.categoria === "" || etiqueta.categoria === filtros.categoria);

  function cambiarCategoria(evento) {
    // Al cambiar de categoria se limpian la subcategoria y las etiquetas.
    onChange({ ...filtros, categoria: evento.target.value, subcategoria: "", etiquetas: [] });
  }

  function alternarEtiqueta(id) {
    const marcadas = filtros.etiquetas.includes(id)
      ? filtros.etiquetas.filter((item) => item !== id)
      : [...filtros.etiquetas, id];

    onChange({ ...filtros, etiquetas: marcadas });
  }

  return (
    <form className="bt-filtros" onSubmit={(evento) => evento.preventDefault()}>
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="filtroCategoria">Categoria</label>
          <select className="form-select" id="filtroCategoria" value={filtros.categoria} onChange={cambiarCategoria}>
            <option value="">Todas las categorias</option>
            {categorias.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="filtroSubcategoria">Subcategoria</label>
          <select className="form-select" id="filtroSubcategoria" value={filtros.subcategoria} disabled={!categoria}
            onChange={(evento) => onChange({ ...filtros, subcategoria: evento.target.value })}>
            <option value="">{categoria ? "Todas" : "Elige una categoria primero"}</option>
            {subcategorias.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4 d-flex justify-content-md-end">
          <button className="btn btn-outline-secondary" type="button" onClick={onLimpiar}>Limpiar filtros</button>
        </div>
      </div>

      {etiquetas.length > 0 && (
        <fieldset className="mt-4">
          <legend className="bt-titulo-seccion">Etiquetas</legend>
          <div className="bt-filtro-etiquetas mt-2">
            {etiquetas.map((etiqueta) => (
              <div className="form-check" key={etiqueta.id}>
                <input className="form-check-input" type="checkbox" id={"etiqueta-" + etiqueta.id}
                  checked={filtros.etiquetas.includes(etiqueta.id)} onChange={() => alternarEtiqueta(etiqueta.id)} />
                <label className="form-check-label" htmlFor={"etiqueta-" + etiqueta.id}>{etiqueta.nombre}</label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
    </form>
  );
}
