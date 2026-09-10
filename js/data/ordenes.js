/**
 * Botanik — Historial de ventas.
 *
 * Cada linea de una orden congela el nombre y el precio que tenia el producto al
 * momento de la venta. Es la diferencia con el carrito, que los resuelve contra
 * el catalogo en cada lectura: una orden es un registro historico y no puede
 * cambiar porque despues se edite el catalogo.
 *
 * Esquema:
 *   {
 *     numero:        "ORD-1001",       // unico
 *     fecha:         "2026-08-14",
 *     clienteRun:    "176543213",
 *     clienteNombre: "",
 *     clienteCorreo: "",
 *     region:        "13",             // id de REGIONES
 *     comuna:        "13110",
 *     direccion:     "",
 *     estado:        "pendiente" | "preparacion" | "despachada" | "entregada" | "cancelada",
 *     cupon:         "BOTANIK10",      // null si no se aplico
 *     subtotal:      0,
 *     descuento:     0,
 *     total:         0,
 *     lineas: [ { codigo, nombre, precio, cantidad } ]
 *   }
 */

const ESTADOS_ORDEN = [
  { id: "pendiente",   nombre: "Pendiente" },
  { id: "preparacion", nombre: "En preparacion" },
  { id: "despachada",  nombre: "Despachada" },
  { id: "entregada",   nombre: "Entregada" },
  { id: "cancelada",   nombre: "Cancelada" }
];

const ORDENES = [
  {
    numero: "ORD-1001",
    fecha: "2026-07-12",
    clienteRun: "176543213",
    clienteNombre: "Josefa Navarro Lillo",
    clienteCorreo: "josefa.navarro@gmail.com",
    region: "13",
    comuna: "13110",
    direccion: "Avenida Vicuna Mackenna 8400, casa 12",
    estado: "entregada",
    cupon: "BIENVENIDA",
    subtotal: 47960,
    descuento: 7194,
    total: 40766,
    lineas: [
      { codigo: "PL-001", nombre: "Monstera deliciosa", precio: 24990, cantidad: 1 },
      { codigo: "MC-002", nombre: "Macetero de ceramica 20 cm con plato", precio: 13990, cantidad: 1 },
      { codigo: "SF-001", nombre: "Sustrato universal 5 L", precio: 4990, cantidad: 1 },
      { codigo: "PL-009", nombre: "Echeveria", precio: 3990, cantidad: 1 },
      { codigo: "PL-023", nombre: "Sobre de semillas de albahaca", precio: 0, cantidad: 2 }
    ]
  },
  {
    numero: "ORD-1002",
    fecha: "2026-07-19",
    clienteRun: "16789013K",
    clienteNombre: "Matias Fuentes Rios",
    clienteCorreo: "matias.fuentes@gmail.com",
    region: "14",
    comuna: "14101",
    direccion: "Calle Yungay 340, Isla Teja",
    estado: "entregada",
    cupon: null,
    subtotal: 34960,
    descuento: 0,
    total: 34960,
    lineas: [
      { codigo: "PL-002", nombre: "Potus", precio: 8990, cantidad: 2 },
      { codigo: "HR-001", nombre: "Tijera de podar", precio: 12990, cantidad: 1 },
      { codigo: "SF-002", nombre: "Sustrato para cactus y suculentas 3 L", precio: 3990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1003",
    fecha: "2026-08-02",
    clienteRun: "212345660",
    clienteNombre: "Antonia Vergara Soto",
    clienteCorreo: "antonia.vergara@duoc.cl",
    region: "13",
    comuna: "13114",
    direccion: "Apoquindo 4500, torre B, departamento 1503",
    estado: "entregada",
    cupon: "BOTANIK10",
    subtotal: 74970,
    descuento: 7497,
    total: 67473,
    lineas: [
      { codigo: "PL-004", nombre: "Ficus lyrata", precio: 34990, cantidad: 1 },
      { codigo: "PL-008", nombre: "Palma areca", precio: 27990, cantidad: 1 },
      { codigo: "MC-003", nombre: "Macetero con autorriego 16 cm", precio: 11990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1004",
    fecha: "2026-08-09",
    clienteRun: "190110222",
    clienteNombre: "Ignacio Munoz Tapia",
    clienteCorreo: "ignacio.munoz@gmail.com",
    region: "10",
    comuna: "10101",
    direccion: "Camino a Chinquihue 1890",
    estado: "cancelada",
    cupon: null,
    subtotal: 19990,
    descuento: 0,
    total: 19990,
    lineas: [
      { codigo: "PL-005", nombre: "Calathea orbifolia", precio: 19990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1005",
    fecha: "2026-08-16",
    clienteRun: "176543213",
    clienteNombre: "Josefa Navarro Lillo",
    clienteCorreo: "josefa.navarro@gmail.com",
    region: "13",
    comuna: "13110",
    direccion: "Avenida Vicuna Mackenna 8400, casa 12",
    estado: "entregada",
    cupon: null,
    subtotal: 16460,
    descuento: 0,
    total: 16460,
    lineas: [
      { codigo: "PL-009", nombre: "Echeveria", precio: 3990, cantidad: 2 },
      { codigo: "PL-010", nombre: "Cactus Mammillaria", precio: 4490, cantidad: 1 },
      { codigo: "SF-002", nombre: "Sustrato para cactus y suculentas 3 L", precio: 3990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1006",
    fecha: "2026-08-21",
    clienteRun: "212345660",
    clienteNombre: "Antonia Vergara Soto",
    clienteCorreo: "antonia.vergara@duoc.cl",
    region: "13",
    comuna: "13114",
    direccion: "Apoquindo 4500, torre B, departamento 1503",
    estado: "despachada",
    cupon: null,
    subtotal: 31980,
    descuento: 0,
    total: 31980,
    lineas: [
      { codigo: "PL-003", nombre: "Sansevieria Laurentii", precio: 15990, cantidad: 2 }
    ]
  },
  {
    numero: "ORD-1007",
    fecha: "2026-08-25",
    clienteRun: "16789013K",
    clienteNombre: "Matias Fuentes Rios",
    clienteCorreo: "matias.fuentes@gmail.com",
    region: "14",
    comuna: "14101",
    direccion: "Calle Yungay 340, Isla Teja",
    estado: "despachada",
    cupon: "VERDE5000",
    subtotal: 53960,
    descuento: 5000,
    total: 48960,
    lineas: [
      { codigo: "PL-006", nombre: "Zamioculca", precio: 17990, cantidad: 1 },
      { codigo: "PL-011", nombre: "Peperomia sandia", precio: 9990, cantidad: 1 },
      { codigo: "MC-002", nombre: "Macetero de ceramica 20 cm con plato", precio: 13990, cantidad: 1 },
      { codigo: "HR-005", nombre: "Regadera metalica 1,5 L", precio: 11990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1008",
    fecha: "2026-08-28",
    clienteRun: "190110222",
    clienteNombre: "Ignacio Munoz Tapia",
    clienteCorreo: "ignacio.munoz@gmail.com",
    region: "10",
    comuna: "10101",
    direccion: "Camino a Chinquihue 1890",
    estado: "preparacion",
    cupon: null,
    subtotal: 28970,
    descuento: 0,
    total: 28970,
    lineas: [
      { codigo: "PL-013", nombre: "Lavanda", precio: 6990, cantidad: 2 },
      { codigo: "PL-012", nombre: "Set de 6 suculentas surtidas", precio: 14990, cantidad: 1 },
      { codigo: "PL-023", nombre: "Sobre de semillas de albahaca", precio: 0, cantidad: 3 }
    ]
  },
  {
    numero: "ORD-1009",
    fecha: "2026-08-30",
    clienteRun: "176543213",
    clienteNombre: "Josefa Navarro Lillo",
    clienteCorreo: "josefa.navarro@gmail.com",
    region: "13",
    comuna: "13110",
    direccion: "Avenida Vicuna Mackenna 8400, casa 12",
    estado: "preparacion",
    cupon: "BOTANIK10",
    subtotal: 40970,
    descuento: 4097,
    total: 36873,
    lineas: [
      { codigo: "PL-007", nombre: "Helecho espada", precio: 7990, cantidad: 1 },
      { codigo: "PL-001", nombre: "Monstera deliciosa", precio: 24990, cantidad: 1 },
      { codigo: "SF-006", nombre: "Fertilizante organico solido 1 kg", precio: 7990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1010",
    fecha: "2026-09-01",
    clienteRun: "212345660",
    clienteNombre: "Antonia Vergara Soto",
    clienteCorreo: "antonia.vergara@duoc.cl",
    region: "13",
    comuna: "13114",
    direccion: "Apoquindo 4500, torre B, departamento 1503",
    estado: "pendiente",
    cupon: null,
    subtotal: 12990,
    descuento: 0,
    total: 12990,
    lineas: [
      { codigo: "HR-001", nombre: "Tijera de podar", precio: 12990, cantidad: 1 },
      { codigo: "PL-023", nombre: "Sobre de semillas de albahaca", precio: 0, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1011",
    fecha: "2026-09-02",
    clienteRun: "16789013K",
    clienteNombre: "Matias Fuentes Rios",
    clienteCorreo: "matias.fuentes@gmail.com",
    region: "14",
    comuna: "14101",
    direccion: "Calle Yungay 340, Isla Teja",
    estado: "pendiente",
    cupon: null,
    subtotal: 8990,
    descuento: 0,
    total: 8990,
    lineas: [
      { codigo: "MC-001", nombre: "Macetero de ceramica mate 14 cm", precio: 8990, cantidad: 1 }
    ]
  },
  {
    numero: "ORD-1012",
    fecha: "2026-09-03",
    clienteRun: "190110222",
    clienteNombre: "Ignacio Munoz Tapia",
    clienteCorreo: "ignacio.munoz@gmail.com",
    region: "10",
    comuna: "10101",
    direccion: "Camino a Chinquihue 1890",
    estado: "pendiente",
    cupon: null,
    subtotal: 53960,
    descuento: 0,
    total: 53960,
    lineas: [
      { codigo: "PL-008", nombre: "Palma areca", precio: 27990, cantidad: 1 },
      { codigo: "PL-003", nombre: "Sansevieria Laurentii", precio: 15990, cantidad: 1 },
      { codigo: "SF-001", nombre: "Sustrato universal 5 L", precio: 4990, cantidad: 2 }
    ]
  }
];
