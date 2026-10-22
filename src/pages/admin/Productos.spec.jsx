/**
 * Prueba de RENDERIZADO DE LISTA: la tabla del administrador dibuja una fila
 * por cada producto que entrega la fuente de datos.
 *
 * Mock: spyOn reemplaza db.getProductos por una lista fija de 3 productos, asi
 * la prueba no depende del catalogo real ni de localStorage.
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { db, Almacen, CLAVES } from "../../services/db.js";
import { SesionProvider } from "../../context/SesionContext.jsx";
import { NotificacionProvider } from "../../context/NotificacionContext.jsx";
import Productos from "./Productos.jsx";

const PRODUCTOS_FALSOS = [
  { codigo: "PL-001", nombre: "Monstera", precio: 1000, stock: 10, stockCritico: 2, categoria: "plantas" },
  { codigo: "MC-001", nombre: "Macetero", precio: 2000, stock: 1, stockCritico: 3, categoria: "maceteros" },
  { codigo: "HR-001", nombre: "Tijera", precio: 3000, stock: 0, stockCritico: 1, categoria: "herramientas" }
];

describe("Admin > Productos", () => {
  beforeEach(() => {
    Almacen.escribir(CLAVES.sesion, { run: "123456785", nombre: "Camila", apellidos: "Rojas", correo: "camila.rojas@profesor.duoc.cl", tipo: "administrador" });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("muestra una fila por cada producto de la lista", () => {
    spyOn(db, "getProductos").and.returnValue(PRODUCTOS_FALSOS);

    render(
      <MemoryRouter>
        <SesionProvider>
          <NotificacionProvider>
            <Productos />
          </NotificacionProvider>
        </SesionProvider>
      </MemoryRouter>
    );

    const filas = screen.getAllByRole("row");

    // 1 fila de encabezado + 3 productos.
    expect(filas.length).toBe(4);
    expect(screen.getByText("Monstera")).toBeTruthy();
    expect(screen.getByText("Tijera")).toBeTruthy();
    expect(db.getProductos).toHaveBeenCalled();
  });
});
