# Changelog

Registro de cambios relevantes del proyecto Botanik.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [2.0.0] — Entrega 2

### Cambiado
- El sitio se migró de HTML y JavaScript sin frameworks a **React 18** con
  React Router y Vite. Cada vista es un componente y la cabecera y el pie se
  escriben una sola vez.
- Bootstrap se instala desde npm. `estilos.css` y `admin.css` se mantienen y se
  importan después de Bootstrap.
- Los arreglos de `js/data/` pasan a `src/data/` como módulos.
- Las imágenes pasan a `public/img/`.

### Agregado

**Datos**
- `src/services/db.js`: fuente de datos simulada con operaciones de crear, leer,
  actualizar y eliminar para productos, categorías, usuarios y órdenes,
  persistidas en `localStorage`.
- Campo opcional `precioOferta` en el catálogo y artículos del blog en
  `src/data/blogs.js`.

**Tienda**
- Vista de categorías con la grilla de cada categoría.
- Vista de ofertas.
- Buscador en la cabecera.
- Checkout con datos del cliente y dirección de entrega, precargados si hay
  sesión iniciada.
- Vistas de compra exitosa, con el resumen de la orden, y de pago fallido, con
  la opción de reintentar.

**Administración**
- Dashboard con indicadores de compras, productos y usuarios.
- Boleta de cada orden con cambio de estado.
- Listado de productos críticos.
- Mantenedor de categorías.
- Historial de compras por usuario.
- Reportes de ventas y perfil del usuario.

**Pruebas**
- Entorno de pruebas con Karma, Jasmine, Testing Library y karma-coverage.
- Pruebas de renderizado de listas, renderizado condicional, propiedades,
  estado y eventos, con mocks mediante `jasmine.createSpy` y `spyOn`.

### Eliminado
- Las vistas HTML y los scripts `main.js`, `ui.js`, `catalogo.js`,
  `carrito.js` y `admin.js` de la entrega 1. Su lógica vive ahora en los
  componentes, contextos y servicios de `src/`.

## [1.0.0] — Entrega 1
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
