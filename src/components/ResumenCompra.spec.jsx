/**
 * Prueba de RENDERIZADO CONDICIONAL: el mensaje de error del cupon solo
 * aparece cuando hay un error.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import ResumenCompra from "./ResumenCompra.jsx";

describe("ResumenCompra", () => {
  it("muestra el error del cupon solo cuando el cupon es invalido", () => {
    // Mock: en vez del carrito real, una funcion espia que siempre rechaza el cupon.
    const aplicarCupon = jasmine.createSpy("onAplicarCupon")
      .and.returnValue({ ok: false, mensaje: "El codigo FALSO no existe." });

    render(<ResumenCompra cantidad={1} subtotal={1000} descuento={0} total={1000} cupon={null}
      onAplicarCupon={aplicarCupon} onQuitarCupon={() => {}} />);

    // Antes de aplicar: no hay error en pantalla.
    expect(screen.queryByRole("alert")).toBeNull();

    fireEvent.change(screen.getByLabelText("Codigo de descuento"), { target: { value: "FALSO" } });
    fireEvent.click(screen.getByText("Aplicar"));

    // Despues de un cupon invalido: el error aparece.
    expect(screen.getByRole("alert").textContent).toBe("El codigo FALSO no existe.");
  });
});
