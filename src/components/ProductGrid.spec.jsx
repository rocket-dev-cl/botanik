/**
 * Prueba de RENDERIZADO DE LISTA: la grilla dibuja una tarjeta por cada
 * producto del arreglo que recibe.
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductGrid from "./ProductGrid.jsx";

const PRODUCTOS = [
  { codigo: "T-001", nombre: "Monstera", precio: 1000, stock: 5 },
  { codigo: "T-002", nombre: "Pothos", precio: 2000, stock: 5 },
  { codigo: "T-003", nombre: "Cactus", precio: 3000, stock: 5 }
];

describe("ProductGrid", () => {
  it("renderiza una tarjeta por cada producto", () => {
    render(
      <MemoryRouter>
        <ProductGrid productos={PRODUCTOS} onAgregar={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("article").length).toBe(3);
    expect(screen.getByText("Monstera")).toBeTruthy();
    expect(screen.getByText("Cactus")).toBeTruthy();
  });
});
