/**
 * Botanik — Validaciones de formularios.
 * Se carga en: registro, login, contacto, y los formularios del administrador.
 *
 * Los mensajes se muestran junto al campo, nunca con alert() (R.21).
 *
 * Reglas del levantamiento:
 *
 *  Correo (todos los formularios)
 *    requerido, max 100, solo @duoc.cl, @profesor.duoc.cl y @gmail.com
 *
 *  Login
 *    contrasena: requerida, entre 4 y 10 caracteres
 *
 *  Contacto
 *    nombre: requerido, max 100
 *    comentario: requerido, max 500
 *
 *  Usuario (registro publico y mantenedor)
 *    RUN: requerido, sin puntos ni guion (ej. 19011022K), min 7, max 9,
 *         con validacion de digito verificador
 *    nombre: requerido, max 50
 *    apellidos: requerido, max 100
 *    fecha de nacimiento: opcional
 *    tipo de usuario: solo en el mantenedor (Administrador, Cliente, Vendedor)
 *    region y comuna: selects dependientes (R.19)
 *    direccion: requerida, max 300
 *
 *  Producto (mantenedor)
 *    codigo: requerido, texto, min 3, sin maximo
 *    nombre: requerido, max 100
 *    descripcion: opcional, max 500
 *    precio: requerido, min 0 (0 = producto FREE), decimales permitidos
 *    stock: requerido, entero, min 0
 *    stock critico: opcional, entero, min 0
 *    categoria y subcategoria: requeridas, selects dependientes
 *    imagen: opcional
 */
