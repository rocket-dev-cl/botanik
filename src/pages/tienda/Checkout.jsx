/**
 * Botanik — Checkout (paso de pago).
 *
 * El cliente revisa lo que compra, completa sus datos y la direccion de
 * entrega, y paga. Si inicio sesion, los datos se completan solos a partir de
 * su registro. Segun lo que responda pago.procesar() se navega a la compra
 * exitosa o al pago fallido.
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormularioEnvio from "../../components/FormularioEnvio.jsx";
import TablaLineas from "../../components/TablaLineas.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { Validaciones, validarFormulario } from "../../services/validaciones.js";
import { formatearPrecio } from "../../services/formato.js";
import { db } from "../../services/db.js";
import { pago } from "../../services/pago.js";

const REGLAS = {
  nombre: Validaciones.nombre,
  apellidos: Validaciones.apellidos,
  correo: Validaciones.correo,
  calle: Validaciones.direccion,
  region: (valor) => Validaciones.seleccion(valor, "una region"),
  comuna: (valor) => Validaciones.seleccion(valor, "una comuna")
};

/* Valores iniciales del formulario: los de un intento fallido (para no volver a
   escribirlos), si no los del usuario con sesion, y si no, vacios. */
function datosIniciales(usuario, anteriores) {
  if (anteriores) {
    return anteriores;
  }

  const registro = usuario ? db.getUsuario(usuario.run) : null;

  return {
    run: registro ? registro.run : "",
    nombre: registro ? registro.nombre : "",
    apellidos: registro ? registro.apellidos : "",
    correo: registro ? registro.correo : "",
    calle: registro ? registro.direccion : "",
    departamento: "",
    region: registro ? registro.region : "",
    comuna: registro ? registro.comuna : "",
    indicaciones: ""
  };
}

export default function Checkout() {
  const { usuario } = useSesion();
  const carrito = useCarrito();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const anteriores = ubicacion.state && ubicacion.state.cliente;

  const [valores, setValores] = useState(() => datosIniciales(usuario, anteriores));
  const [errores, setErrores] = useState({});
  const [simularRechazo, setSimularRechazo] = useState(false);

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  if (carrito.detalle.length === 0) {
    return (
      <section className="bt-seccion">
        <div className="container text-center bt-vacio">
          <h1 className="h3">No hay productos para pagar</h1>
          <p>Agrega productos al carrito antes de ir al pago.</p>
          <Link className="btn btn-primary" to="/productos">Ver productos</Link>
        </div>
      </section>
    );
  }

  /* El precio se congela en la linea: es el que se paga hoy. */
  const lineas = carrito.detalle.map((linea) => ({
    codigo: linea.producto.codigo,
    nombre: linea.producto.nombre,
    imagen: linea.producto.imagen,
    precio: linea.subtotal / linea.cantidad,
    cantidad: linea.cantidad
  }));

  function pagar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario(valores, REGLAS);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const compra = {
      cliente: valores,
      lineas,
      cupon: carrito.cupon,
      subtotal: carrito.subtotal,
      descuento: carrito.descuento,
      total: carrito.total
    };

    const respuesta = pago.procesar({ ...compra, simularRechazo });

    if (respuesta.ok) {
      carrito.vaciar();
      navegar("/compra/exitosa/" + respuesta.orden.numero);
    } else {
      navegar("/compra/fallida", { state: { ...compra, motivo: respuesta.motivo } });
    }
  }

  return (
    <section className="bt-seccion">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <form className="bt-tarjeta-form" onSubmit={pagar} noValidate>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h1 className="h3 mb-1">Carrito de compra</h1>
                  <p className="form-text mt-0 mb-0">Revisa tu pedido y completa tus datos.</p>
                </div>
                <span className="btn btn-primary disabled">Total a pagar: {formatearPrecio(carrito.total)}</span>
              </div>

              <TablaLineas lineas={lineas} />

              {carrito.descuento > 0 && (
                <p className="text-end small mt-2 mb-0">
                  Cupon {carrito.cupon.codigo}: -{formatearPrecio(carrito.descuento)}
                </p>
              )}

              <FormularioEnvio valores={valores} onChange={cambiar} errores={errores} />

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="simularRechazo" checked={simularRechazo} onChange={(evento) => setSimularRechazo(evento.target.checked)} />
                <label className="form-check-label small" htmlFor="simularRechazo">Simular pago rechazado (demostracion)</label>
              </div>

              <div className="text-end">
                <button className="btn btn-success btn-lg" type="submit">Pagar ahora {formatearPrecio(carrito.total)}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
