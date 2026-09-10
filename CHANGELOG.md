# Changelog

Registro de cambios relevantes del proyecto Botanik.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [No publicado]

### Agregado

**Base**
- Hoja de estilos `css/estilos.css` completa: paleta de marca, tipografía Outfit,
  escala tipográfica, radios y sombras, mapeados sobre las variables `--bs-*` de
  Bootstrap.
- Hoja `css/admin.css` con el layout de menú vertical, tablas ordenables y
  formularios del mantenedor.
- `js/main.js`: sesión, contador del carrito, enlace activo, tooltips y
  formulario de suscripción del pie.
- `js/ui.js`: modal de confirmación, toasts y mensajes de error junto al campo.
  No se utiliza `alert()` ni `confirm()` en el proyecto.

**Datos**
- Catálogo con 46 productos, 16 regiones con sus comunas y 8 usuarios de los
  tres perfiles.

**Tienda**
- Home con hero, ocho productos destacados y resumen por categoría.
- Catálogo con filtros por categoría, subcategoría y etiquetas, sin recarga.
- Detalle de producto con galería de miniaturas y productos relacionados.
- Carrito con persistencia en `localStorage`, control de cantidades, cupones de
  descuento y estado vacío.
- Páginas Nosotros, Blogs y dos artículos de detalle.
- Formulario de contacto con validación.

**Autenticación**
- Inicio de sesión y registro de usuario con validación completa, incluido el
  dígito verificador del RUN y los selects dependientes de región y comuna.

**Administración**
- Mantenedor de productos: listar, crear, editar y eliminar, con alerta de stock
  crítico y marca de producto agotado.
- Mantenedor de usuarios: listar, crear, editar y eliminar, sin permitir RUN ni
  correo repetidos.
- Ordenamiento por columna, búsqueda y paginación en ambos listados.
- Control de acceso por perfil: las opciones ajenas al rol se quitan del marcado.

### Notas
- El video de la página Nosotros espera el archivo
  `img/ui/botanik-invernadero.mp4`. Mientras no exista se muestra la imagen de
  portada.
- El módulo de administración guarda sus cambios en `localStorage`. El botón
  «Restaurar datos» vuelve al estado de los archivos de `js/data/`.
