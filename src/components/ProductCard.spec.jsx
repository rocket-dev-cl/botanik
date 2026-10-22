/**
 * Prueba de EVENTOS: al hacer clic en el boton de anadir, la tarjeta ejecuta
 * onAgregar con el codigo del producto.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

describe("ProductCard", () => {
  it("al hacer clic en anadir llama a onAgregar con el codigo", () => {
    const producto = { codigo: "PL-001", nombre: "Monstera deliciosa", precio: 24990, stock: 18 };
    // Mock: una funcion espia en lugar del carrito real.
    const alAgregar = jasmine.createSpy("onAgregar");

    render(
      <MemoryRouter>
        <ProductCard producto={producto} onAgregar={alAgregar} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Anadir Monstera deliciosa al carrito" }));

    expect(alAgregar).toHaveBeenCalledWith("PL-001");
  });
});
