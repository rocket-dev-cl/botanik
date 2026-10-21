/**
 * Pruebas de las reglas de validacion. Son funciones puras: reciben un valor y
 * devuelven { valido, mensaje }, asi que se prueban sin renderizar nada.
 */

import { Validaciones, validarFormulario } from "./validaciones.js";

describe("Validaciones", () => {
  it("acepta un RUN con digito verificador correcto y rechaza uno incorrecto", () => {
    expect(Validaciones.run("123456785").valido).toBeTrue();
    expect(Validaciones.run("123456789").valido).toBeFalse();
    expect(Validaciones.run("12.345.678-5").valido).toBeFalse();
  });

  it("solo acepta los dominios de correo permitidos", () => {
    expect(Validaciones.correo("ana@duoc.cl").valido).toBeTrue();
    expect(Validaciones.correo("ana@gmail.com").valido).toBeTrue();
    expect(Validaciones.correo("ana@hotmail.com").valido).toBeFalse();
  });

  it("exige una contrasena de 4 a 10 caracteres", () => {
    expect(Validaciones.contrasena("123").valido).toBeFalse();
    expect(Validaciones.contrasena("1234").valido).toBeTrue();
    expect(Validaciones.contrasena("12345678901").valido).toBeFalse();
  });

  it("valida precio y stock del producto", () => {
    expect(Validaciones.precio("0").valido).toBeTrue();
    expect(Validaciones.precio("-1").valido).toBeFalse();
    expect(Validaciones.stock("2.5").valido).toBeFalse();
    expect(Validaciones.stockCritico("").valido).toBeTrue();
  });

  it("validarFormulario devuelve solo los campos con error", () => {
    const errores = validarFormulario(
      { nombre: "Ana", correo: "ana@hotmail.com" },
      { nombre: Validaciones.nombre, correo: Validaciones.correo }
    );

    expect(Object.keys(errores)).toEqual(["correo"]);
  });
});
