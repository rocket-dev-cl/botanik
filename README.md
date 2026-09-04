# Botanik

Sitio de comercio electrónico para un vivero: catálogo de plantas, maceteros,
sustratos, fertilizantes y herramientas de jardinería, con carrito de compras y un
módulo de administración para mantener el catálogo y los usuarios.

## Estado

Fase 1 en desarrollo. Esta fase construye la interfaz completa y la lógica que se
ejecuta en el navegador. No incluye servidor ni base de datos: los datos se definen en
arreglos de JavaScript y el carrito persiste en `localStorage`.

## Tecnologías

- HTML5 con etiquetado semántico
- CSS3 en hojas externas, sin estilos embebidos
- JavaScript sin frameworks
- Bootstrap como base de maquetación, con hoja de estilos propia por encima

## Estructura del proyecto

```
botanik/
├── index.html              Home de la tienda
├── productos.html          Catálogo con filtros
├── detalle-producto.html   Ficha de un producto
├── carrito.html            Carrito de compras
├── nosotros.html
├── blogs.html
├── blog-1.html
├── blog-2.html
├── contacto.html
├── login.html
├── registro.html
├── admin/                  Módulo de administración
│   ├── index.html
│   ├── productos.html
│   ├── producto-form.html
│   ├── usuarios.html
│   └── usuario-form.html
├── css/
│   ├── estilos.css         Estilos de la tienda pública
│   └── admin.css           Estilos del módulo de administración
├── js/
│   ├── data/               Datos del sistema, sin lógica
│   │   ├── productos.js
│   │   ├── categorias.js
│   │   ├── regiones.js
│   │   └── usuarios.js
│   ├── main.js             Comportamiento común a todas las páginas
│   ├── catalogo.js         Listado, filtros y detalle de productos
│   ├── carrito.js          Carrito y persistencia
│   ├── validaciones.js     Validaciones de formularios
│   ├── ui.js               Modales, toasts y componentes de interfaz
│   └── admin.js            Mantenedores y control de acceso
└── img/
    ├── productos/
    ├── blog/
    └── ui/
```

### Decisiones de estructura

**No se usa `assets/`.** Con solo tres tipos de recurso (css, js, img) ese nivel
adicional de anidamiento no aporta nada y alarga todas las rutas.

**No se usa `src/` y `dist/`.** Esa separación existe cuando hay un proceso de
construcción que transforma el código fuente en código publicable. Este proyecto no
tiene ese paso, por lo que `dist/` sería una copia manual de `src/`.

**El CSS se divide por módulo, no por página.** El encabezado, el menú y el pie son los
mismos en todas las vistas de la tienda: una hoja por página duplicaría ese código y
obligaría a editar diez archivos ante cualquier cambio.

**Los datos están separados de la lógica** (`js/data/`). Actualizar el catálogo no debe
requerir modificar el código que lo muestra. `js/data/categorias.js` es además la fuente
de verdad de la taxonomía del catálogo: define las categorías, sus subcategorías y el
listado cerrado de etiquetas.

**`admin/` es una carpeta aparte** porque refleja los dos módulos definidos en la
arquitectura del sistema. Ambos módulos comparten la misma arquitectura de páginas,
estilos y componentes: la separación es de responsabilidad, no de tecnología.

### Sobre la repetición del encabezado y los componentes

El encabezado, la navegación y el pie de página están escritos de forma literal en cada
página, tanto en la tienda como en el administrador. Fue una decisión deliberada.

Se evaluaron tres alternativas para evitar la duplicación —inyección mediante `fetch`,
generación por JavaScript y Web Components— y las tres se descartaron por la misma
razón: el marcado semántico dejaría de existir en el documento entregado y pasaría a
generarse solo en tiempo de ejecución.

El criterio que gobierna la decisión es:

> **El marcado que es contenido se escribe literal. El marcado que es interfaz se
> genera.**

Un `header`, un `nav`, un `main` y un `footer` son contenido y deben estar en el
archivo. Un modal de confirmación, un toast de aviso o un tooltip son comportamiento con
forma visual: no son contenido y se generan desde JavaScript.

Por eso `js/ui.js` concentra los componentes de interfaz reutilizables sobre Bootstrap:

- `confirmar(mensaje)` — abre un único modal genérico y resuelve según la respuesta. Se
  utiliza en todas las eliminaciones del administrador.
- `notificar(mensaje, tipo)` — muestra un toast para confirmar el resultado de una
  acción.

Ambas funciones existen para cumplir un requisito propio: los mensajes del sistema no
deben usar las ventanas de alerta del navegador. **No se utilizan `alert()` ni
`confirm()` en ningún punto del proyecto.**

La inicialización de los tooltips de Bootstrap se realiza una sola vez en `js/main.js`,
ya que Bootstrap no los activa automáticamente.

Las páginas nuevas se crean a partir de una página existente, no desde cero, para que
el esqueleto se mantenga idéntico en todas.

## Sobre el uso de Bootstrap

Bootstrap aporta la grilla, el sistema responsivo y los componentes con comportamiento.
La identidad visual de Botanik —paleta, tipografía, tarjeta de producto, etiquetas— se
define en `css/estilos.css`, sobrescribiendo las variables CSS de Bootstrap en lugar de
competir contra sus estilos.

Se requiere `bootstrap.bundle.min.js`, que incluye Popper. La versión sin el bundle deja
sin funcionar los dropdowns y los tooltips.

## Cómo ejecutar el proyecto

El sitio es estático y no requiere instalación: basta abrir `index.html` en un
navegador.

Para desarrollar se recomienda la extensión **Live Server** de Visual Studio Code, que
recarga el navegador al guardar.

## Convención de mensajes de commit

Se utiliza [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<área>): <qué se hizo>
```

| Tipo | Cuándo se usa |
|---|---|
| `feat` | Se agrega una funcionalidad nueva |
| `fix` | Se corrige un error |
| `style` | Cambios visuales o de formato, sin alterar comportamiento |
| `refactor` | Se reorganiza código sin cambiar lo que hace |
| `docs` | Documentación |
| `chore` | Configuración, estructura, tareas de mantenimiento |

Ejemplos:

```
feat(carrito): persistir el contenido en localStorage
fix(registro): corregir el cálculo del dígito verificador del RUN
style(catalogo): ajustar la grilla de productos en pantallas pequeñas
docs(readme): documentar la estructura de carpetas
```

## Flujo de trabajo

La rama `main` se mantiene siempre funcional. El trabajo se realiza en ramas por
funcionalidad y se integra mediante Pull Request revisado por el otro integrante.

```
feat/nombre-de-la-funcionalidad
fix/descripcion-del-error
docs/tema
```

## Documentación

Este repositorio contiene únicamente `README.md` y `CHANGELOG.md`.

La especificación de requisitos, la planilla de requerimientos, el análisis de
interfaces y la bitácora de decisiones son documentación de gestión del proyecto y se
mantienen fuera del repositorio. Lo que se versiona acá es lo que necesita quien clona
para entender y ejecutar el código.

