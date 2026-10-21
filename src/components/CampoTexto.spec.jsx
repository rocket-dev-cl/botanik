/**
 * Prueba de PROPIEDADES (props): el campo muestra lo que recibe y avisa los
 * cambios a quien lo usa a traves de la funcion onChange.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import CampoTexto from "./CampoTexto.jsx";

describe("CampoTexto", () => {
  it("usa el label, el valor y la funcion onChange que recibe por props", () => {
    // Mock: una funcion espia en lugar de un formulario real.
    const alCambiar = jasmine.createSpy("onChange");

    render(<CampoTexto id="nombre" label="Nombre" value="Ana" onChange={alCambiar} />);

    const campo = screen.getByLabelText("Nombre");
    expect(campo.value).toBe("Ana");

    fireEvent.change(campo, { target: { value: "Ana Maria" } });
    expect(alCambiar).toHaveBeenCalledWith("nombre", "Ana Maria");
  });
});
