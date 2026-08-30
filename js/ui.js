/**
 * Botanik — Componentes de interfaz reutilizables sobre Bootstrap.
 *
 * Regla del proyecto: el marcado que es CONTENIDO se escribe literal en el
 * HTML; el marcado que es INTERFAZ se genera desde aqui.
 *
 * IMPORTANTE: el criterio de aceptacion de R.21 prohibe usar las ventanas de
 * alerta del navegador. No se usa alert() ni confirm() en ningun punto del
 * proyecto: se usan estas funciones.
 *
 * Responsabilidades:
 *  - confirmar(mensaje): abre UN modal generico reutilizado en todo el
 *    proyecto y resuelve segun la respuesta del usuario. Usado en las
 *    eliminaciones del administrador (criterio de aceptacion de R.14).
 *  - notificar(mensaje, tipo): muestra un toast con el resultado de una accion.
 *  - mostrarError(campo, mensaje) / limpiarError(campo): pintan el mensaje
 *    junto al campo que lo origina, sin perder lo que el usuario escribio (R.21).
 *
 * El marcado del modal y del contenedor de toasts se inyecta desde aqui una
 * sola vez, para no repetirlo en las 16 paginas.
 */
