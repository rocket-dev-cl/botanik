/**
 * Prueba de ESTADO: el formulario de contacto guarda en su estado lo que el
 * usuario escribe, y el campo muestra ese estado.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "./Contacto.jsx";

describe("Contacto", () => {
  it("actualiza el estado del formulario cuando el usuario escribe", () => {
    render(<Contacto />);

    const nombre = screen.getByLabelText(/Nombre completo/);
    expect(nombre.value).toBe("");

    fireEvent.change(nombre, { target: { value: "Camila Leiva" } });
    expect(nombre.value).toBe("Camila Leiva");

    // El contador del comentario tambien sale del estado.
    fireEvent.change(screen.getByLabelText(/Comentario/), { target: { value: "Hola" } });
    expect(screen.getByText("4 de 500 caracteres")).toBeTruthy();
  });
});
