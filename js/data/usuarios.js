/**
 * Botanik — Usuarios del sistema.
 * Datos de ejemplo para el mantenedor y para probar el control de acceso.
 *
 * Esquema:
 *
 *   {
 *     run:          "19011022K",   // requerido, sin puntos ni guion, 7 a 9, con DV valido
 *     nombre:       "",            // requerido, max 50
 *     apellidos:    "",            // requerido, max 100
 *     correo:       "",            // requerido, max 100, dominios permitidos
 *     fechaNacimiento: null,       // opcional
 *     tipo:         "cliente",     // requerido: administrador | vendedor | cliente
 *     region:       "",            // requerido
 *     comuna:       "",            // requerido
 *     direccion:    ""             // requerido, max 300
 *   }
 *
 * ADVERTENCIA: las contrasenas no se almacenan aca. Sin capa de servidor no
 * es posible resguardarlas, y el ERS declara explicitamente que la validacion
 * en el navegador no constituye un mecanismo de seguridad (seccion 3.3.2).
 *
 * TODO: cargar un usuario de cada perfil para probar R.18.
 */

const USUARIOS = [
];
