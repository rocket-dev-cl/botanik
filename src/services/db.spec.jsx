/**
 * Pruebas de la fuente de datos (CRUD).
 * Cada prueba parte de los datos de fabrica: se limpia localStorage antes.
 */

import { db, CLAVES } from "./db.js";

describe("db (fuente de datos simulada)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("lee el catalogo de fabrica cuando no hay nada guardado", () => {
    expect(db.getProductos().length).toBe(46);
    expect(db.getProducto("PL-001").nombre).toBe("Monstera deliciosa");
  });

  it("crea un producto y lo escribe en localStorage", () => {
    // Mock: se espia setItem para comprobar que se persistio sin depender del navegador.
    spyOn(Storage.prototype, "setItem").and.callThrough();

    const respuesta = db.crearProducto({ codigo: "PL-999", nombre: "Prueba", precio: 1000, stock: 3, categoria: "plantas" });

    expect(respuesta.ok).toBeTrue();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(CLAVES.productos, jasmine.any(String));
    expect(db.getProducto("PL-999")).not.toBeNull();
  });

  it("no permite repetir el codigo de un producto", () => {
    const respuesta = db.crearProducto({ codigo: "PL-001", nombre: "Duplicado" });
    expect(respuesta.ok).toBeFalse();
  });

  it("actualiza y elimina un producto", () => {
    db.actualizarProducto("PL-001", { precio: 1 });
    expect(db.getProducto("PL-001").precio).toBe(1);

    db.eliminarProducto("PL-001");
    expect(db.getProducto("PL-001")).toBeNull();
  });

  it("crea una orden con numero correlativo y descuenta el stock", () => {
    const stockAntes = db.getProducto("PL-001").stock;
    const numeroEsperado = db.siguienteNumeroOrden();

    const { dato } = db.crearOrden({ lineas: [{ codigo: "PL-001", cantidad: 2 }] });
    db.descontarStock(dato.lineas);

    expect(dato.numero).toBe(numeroEsperado);
    expect(db.getProducto("PL-001").stock).toBe(stockAntes - 2);
  });
  it("no permite repetir RUN ni correo al crear usuarios", () => {
    const base = { run: "111111111", nombre: "Ana", apellidos: "Paz", correo: "ana.paz@gmail.com", tipo: "cliente" };

    expect(db.crearUsuario(base).ok).toBeTrue();
    expect(db.crearUsuario({ ...base, correo: "otra@gmail.com" }).ok).toBeFalse();
    expect(db.crearUsuario({ ...base, run: "222222222" }).ok).toBeFalse();
    expect(db.buscarUsuarioPorCorreo("ANA.PAZ@gmail.com").run).toBe("111111111");
  });

  it("no elimina una categoria que todavia tiene productos", () => {
    expect(db.eliminarCategoria("plantas").ok).toBeFalse();

    db.crearCategoria({ id: "semillas", nombre: "Semillas" });
    expect(db.eliminarCategoria("semillas").ok).toBeTrue();
  });

  it("restaurar vuelve a los datos de fabrica", () => {
    db.eliminarProducto("PL-001");
    db.restaurar();

    expect(db.getProducto("PL-001")).not.toBeNull();
  });
});
