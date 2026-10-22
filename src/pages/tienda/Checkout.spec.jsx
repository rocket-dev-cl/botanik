/**
 * Pruebas del checkout.
 *
 * ESTADO: al escribir en el formulario, el estado cambia y el input muestra el
 * nuevo valor.
 * EVENTO: el clic en "Pagar ahora" ejecuta pago.procesar con los datos de la
 * compra. pago.procesar es un mock (spyOn): la prueba no crea ordenes reales.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SesionProvider } from "../../context/SesionContext.jsx";
import { NotificacionProvider } from "../../context/NotificacionContext.jsx";
import { CarritoProvider } from "../../context/CarritoContext.jsx";
import { CLAVES } from "../../services/db.js";
import { pago } from "../../services/pago.js";
import Checkout from "./Checkout.jsx";

function renderizarCheckout() {
  render(
    <MemoryRouter>
      <SesionProvider>
        <NotificacionProvider>
          <CarritoProvider>
            <Checkout />
          </CarritoProvider>
        </NotificacionProvider>
      </SesionProvider>
    </MemoryRouter>
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("Checkout", () => {
  beforeEach(() => {
    // Un carrito con dos Monsteras y sin sesion iniciada.
    localStorage.clear();
    localStorage.setItem(CLAVES.carrito, JSON.stringify([{ codigo: "PL-001", cantidad: 2 }]));
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("actualiza el estado del formulario cuando el usuario escribe", () => {
    renderizarCheckout();
    const nombre = screen.getByLabelText(/^Nombre/);

    expect(nombre.value).toBe("");
    fireEvent.change(nombre, { target: { value: "Pedro" } });
    expect(nombre.value).toBe("Pedro");
  });

  it("al hacer clic en Pagar ahora ejecuta el pago con los datos de la compra", () => {
    spyOn(pago, "procesar").and.returnValue({ ok: true, orden: { numero: "ORD-2000" } });
    renderizarCheckout();

    escribir(/^Nombre/, "Pedro");
    escribir(/^Apellidos/, "Soto");
    escribir(/^Correo/, "pedro@gmail.com");
    escribir(/^Calle/, "Los Crisantemos 123");
    escribir(/^Region/, "13");
    escribir(/^Comuna/, "13101");

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(pago.procesar).toHaveBeenCalledTimes(1);
    const compra = pago.procesar.calls.mostRecent().args[0];
    expect(compra.cliente.nombre).toBe("Pedro");
    expect(compra.lineas[0].cantidad).toBe(2);
  });
});
