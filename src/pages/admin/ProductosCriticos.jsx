/**
 * Botanik — Productos en stock critico.
 * Mismo listado que Productos, filtrado por stock <= stock critico.
 */

import { db } from "../../services/db.js";
import { useSesion } from "../../context/SesionContext.jsx";
import TablaProductos from "./TablaProductos.jsx";
import { enStockCritico } from "./utilidades.js";

export default function ProductosCriticos() {
  const { esAdministrador } = useSesion();
  const criticos = db.getProductos().filter(enStockCritico);

  return (
    <>
      <div className="bt-admin-encabezado">
        <div>
          <h1>Productos criticos</h1>
          <p className="text-body-secondary mb-0">Productos cuyo stock es igual o menor a su stock critico. Conviene reponerlos.</p>
        </div>
      </div>

      <TablaProductos productos={criticos} puedeEditar={esAdministrador} />
      <p className="text-body-secondary small" role="status">{criticos.length} productos en stock critico</p>
    </>
  );
}
