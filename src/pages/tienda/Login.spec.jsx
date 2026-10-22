/**
 * Prueba de RENDERIZADO CONDICIONAL: el mensaje de error del correo existe
 * solo cuando hay un error. Antes de enviar no se muestra; con un dominio no
 * permitido, aparece.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SesionProvider } from "../../context/SesionContext.jsx";
import { NotificacionProvider } from "../../context/NotificacionContext.jsx";
import Login from "./Login.jsx";

function renderizarLogin() {
  render(
    <MemoryRouter>
      <SesionProvider>
        <NotificacionProvider>
          <Login />
        </NotificacionProvider>
      </SesionProvider>
    </MemoryRouter>
  );
}

describe("Login", () => {
  it("muestra el error del correo solo cuando el correo no es valido", () => {
    renderizarLogin();
    const mensaje = /dominio no esta permitido/i;

    // Sin error: el mensaje no esta en la pagina.
    expect(screen.queryByText(mensaje)).toBeNull();

    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@hotmail.com" } });
    fireEvent.change(screen.getByLabelText(/contrasena/i), { target: { value: "1234" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Con error: el mensaje aparece.
    expect(screen.getByText(mensaje)).toBeTruthy();
  });
});
