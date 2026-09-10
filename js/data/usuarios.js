/**
 * Botanik — Usuarios del sistema.
 * Datos de ejemplo para el mantenedor y para probar el control de acceso.
 *
 * Esquema:
 *
 *   {
 *     run:          "190110222",   // requerido, sin puntos ni guion, 7 a 9, con DV valido
 *     nombre:       "",            // requerido, max 50
 *     apellidos:    "",            // requerido, max 100
 *     correo:       "",            // requerido, max 100, dominios permitidos
 *     fechaNacimiento: null,       // opcional, formato YYYY-MM-DD
 *     tipo:         "cliente",     // requerido: administrador | vendedor | cliente
 *     region:       "13",          // requerido, id de REGIONES
 *     comuna:       "13123",       // requerido, id de comuna dentro de esa region
 *     direccion:    ""             // requerido, max 300
 *   }
 *
 * ADVERTENCIA: las contrasenas no se almacenan aca. Sin capa de servidor no
 * es posible resguardarlas, y el ERS declara explicitamente que la validacion
 * en el navegador no constituye un mecanismo de seguridad (seccion 3.3.2).
 *
 * REGION Y COMUNA SE GUARDAN COMO ID, NO COMO NOMBRE
 *   Es lo que devuelve el select y lo que permite reconstruir la seleccion al
 *   editar. Guardar "Providencia" obligaria a buscar por texto para volver a
 *   marcar la opcion, y cualquier cambio de nombre dejaria el dato huerfano.
 *   El nombre visible se resuelve contra REGIONES al momento de mostrarlo.
 *
 * TODOS LOS RUN DE ESTA LISTA TIENEN DIGITO VERIFICADOR VALIDO
 *   Se calcularon con modulo 11. Sirven como casos de prueba de la validacion
 *   y cubren a proposito los tres finales posibles:
 *     - DV numerico corriente (la mayoria)
 *     - DV igual a K        -> 16789013K
 *     - DV igual a 0        -> 212345660
 *     - RUN de 8 caracteres -> 98765433, para ejercitar el largo minimo
 *
 * OJO CON EL EJEMPLO DEL ANEXO
 *   El Anexo 1 ilustra el formato del RUN con "19011022K". Ese numero no pasa
 *   la validacion: el digito verificador de 19011022 es 2, no K. Si se usa tal
 *   cual en una prueba, la validacion lo va a rechazar y va a parecer un error
 *   del codigo. Aca quedo cargado como 190110222, que es el valor correcto.
 */

const USUARIOS = [
  {
    run: "123456785",
    nombre: "Camila",
    apellidos: "Rojas Fuentes",
    correo: "camila.rojas@profesor.duoc.cl",
    fechaNacimiento: "1988-03-14",
    tipo: "administrador",
    region: "13",
    comuna: "13123",
    direccion: "Avenida Providencia 1234, departamento 802"
  },
  {
    run: "156782343",
    nombre: "Diego",
    apellidos: "Salinas Miranda",
    correo: "d.salinas@duoc.cl",
    fechaNacimiento: "1995-11-02",
    tipo: "administrador",
    region: "05",
    comuna: "05109",
    direccion: "Calle Valparaiso 567, Vina del Mar"
  },
  {
    run: "201234565",
    nombre: "Valentina",
    apellidos: "Cortes Aguilera",
    correo: "v.cortes@duoc.cl",
    fechaNacimiento: "2001-07-23",
    tipo: "vendedor",
    region: "13",
    comuna: "13119",
    direccion: "Pasaje Los Aromos 89, Villa El Bosque"
  },
  {
    run: "98765433",
    nombre: "Nicolas",
    apellidos: "Herrera Pinto",
    correo: "nicolas.herrera@gmail.com",
    fechaNacimiento: "1992-01-30",
    tipo: "vendedor",
    region: "08",
    comuna: "08101",
    direccion: "OHiggins 2210, oficina 45"
  },
  {
    run: "176543213",
    nombre: "Josefa",
    apellidos: "Navarro Lillo",
    correo: "josefa.navarro@gmail.com",
    fechaNacimiento: "1999-05-17",
    tipo: "cliente",
    region: "13",
    comuna: "13110",
    direccion: "Avenida Vicuna Mackenna 8400, casa 12"
  },
  {
    run: "16789013K",
    nombre: "Matias",
    apellidos: "Fuentes Rios",
    correo: "matias.fuentes@gmail.com",
    fechaNacimiento: "1997-09-08",
    tipo: "cliente",
    region: "14",
    comuna: "14101",
    direccion: "Calle Yungay 340, Isla Teja"
  },
  {
    run: "212345660",
    nombre: "Antonia",
    apellidos: "Vergara Soto",
    correo: "antonia.vergara@duoc.cl",
    fechaNacimiento: "2003-12-05",
    tipo: "cliente",
    region: "13",
    comuna: "13114",
    direccion: "Apoquindo 4500, torre B, departamento 1503"
  },
  {
    run: "190110222",
    nombre: "Ignacio",
    apellidos: "Munoz Tapia",
    correo: "ignacio.munoz@gmail.com",
    fechaNacimiento: null,
    tipo: "cliente",
    region: "10",
    comuna: "10101",
    direccion: "Camino a Chinquihue 1890"
  }
];
