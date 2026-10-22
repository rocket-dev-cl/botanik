/**
 * Prueba de PROPIEDADES (props): el boton muestra la etiqueta que recibe y
 * ejecuta la funcion onClick que recibe.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Boton from "./Boton.jsx";

describe("Boton", () => {
  it("recibe la etiqueta y la funcion onClick por props", () => {
    // Mock: una funcion espia para saber si el boton la llamo.
    const alHacerClic = jasmine.createSpy("onClick");

    render(<Boton etiqueta="Comprar ahora" onClick={alHacerClic} />);

    const boton = screen.getByRole("button", { name: "Comprar ahora" });
    fireEvent.click(boton);

    expect(boton.textContent).toBe("Comprar ahora");
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });
});
