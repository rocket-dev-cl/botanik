# Botanik

Sitio de comercio electrónico para un vivero: catálogo de plantas, maceteros,
sustratos, fertilizantes y herramientas de jardinería, con carrito de compras,
checkout y un módulo de administración.

## Estado

**Entrega 2.** El sitio de la entrega 1 (HTML, CSS y JavaScript sin frameworks) se
migró a **React**. Se agregaron las vistas de categorías, ofertas, checkout, compra
exitosa y pago fallido, el administrador completo y pruebas unitarias con **Jasmine
y Karma**.

La versión de la entrega 1 queda en el tag [`entrega-1`](../../tree/entrega-1).

Sigue sin haber servidor: los datos parten de arreglos de JavaScript y se persisten en
`localStorage` a través de `src/services/db.js`.

## Cómo ejecutarlo

Requiere Node.js 18 o superior.

```
npm install
npm run dev       # sitio en http://localhost:5173
npm test          # pruebas unitarias con Karma + Jasmine y reporte de cobertura
npm run test:ver  # las mismas pruebas en un Chrome visible, con la pagina de Jasmine
npm run build     # version de produccion en dist/
```

Cuentas de prueba (no se verifican contraseñas, basta un largo de 4 a 10):

| Perfil | Correo |
|---|---|
| Administrador | `camila.rojas@profesor.duoc.cl` |
| Vendedor | `v.cortes@duoc.cl` |
| Cliente | `josefa.navarro@gmail.com` |

Cupones: `BOTANIK10`, `BIENVENIDA`, `VERDE5000`.

## Tecnologías

- React 18 con React Router
- Vite para desarrollo y construcción
- Bootstrap 5 como base responsiva, con hoja de estilos propia por encima
- Jasmine + Karma + Testing Library para las pruebas unitarias, karma-coverage para la cobertura

## Estructura

```
botanik/
├── index.html                  Única página: React monta la app en #root
├── public/img/                 Imágenes, servidas tal cual
├── src/
│   ├── main.jsx                Punto de entrada: estilos, Bootstrap y router
│   ├── App.jsx                 Proveedores y rutas
│   ├── data/                   Datos de fábrica, sin lógica
│   ├── services/
│   │   ├── db.js               Fuente de datos simulada: CRUD sobre localStorage
│   │   ├── carrito.js          Cálculos del carrito y cupones
│   │   ├── pago.js             Pago simulado
│   │   ├── validaciones.js     Reglas de validación de formularios
│   │   └── formato.js          Precios, fechas y rutas de imagen
│   ├── context/                Estado compartido: sesión, carrito y avisos
│   ├── components/             Piezas reutilizables (tarjeta, grilla, campos...)
│   ├── pages/tienda/           Una vista por ruta de la tienda
│   ├── pages/admin/            Una vista por ruta del administrador
│   ├── rutas/                  Rutas de cada módulo, en archivos separados
│   └── styles/                 estilos.css y admin.css
├── karma.conf.cjs              Configuración de las pruebas
└── babel.config.cjs            Compilación de JSX para las pruebas
```

Las pruebas viven junto a lo que prueban: `ProductCard.jsx` y `ProductCard.spec.jsx`.

### Decisiones

**Ahora sí hay `src/`.** En la entrega 1 no existía un paso de construcción y la
carpeta no se justificaba. Con React el JSX se compila, así que se separa el código
fuente (`src/`) de lo que se publica (`dist/`, generado y no versionado).

**Componentes en vez de marcado repetido.** La cabecera y el pie eran literales en
cada HTML. En React son `Navbar` y `Footer`, y `Layout` los pone alrededor de cada
página.

**Toda lectura y escritura de datos pasa por `db.js`.** Ningún componente toca los
arreglos de `src/data/` directamente. Por eso un producto editado en el administrador
se ve igual en la tienda, y una compra aparece al tiro en el historial de órdenes.

**Estado local primero, contexto solo cuando se comparte.** Cada formulario guarda sus
campos en su propio `useState`. Solo la sesión, el carrito y los avisos están en un
contexto, porque los necesitan componentes que no tienen relación de padre e hijo.

**Rutas por módulo.** Cada módulo registra sus rutas en su archivo de `src/rutas/`,
para que dos ramas en paralelo no editen el mismo listado.

**No se usa `alert()` ni `confirm()`.** Los avisos son toasts (`useNotificacion`) y
las confirmaciones, el componente `ModalConfirmacion`.

## Sobre el uso de Bootstrap

Bootstrap aporta la grilla, el sistema responsivo y los componentes con comportamiento
(menú desplegable, menú hamburguesa). Se carga desde npm en `main.jsx`, con el bundle
que incluye Popper.

La identidad visual de Botanik —paleta, tipografía, tarjeta de producto, etiquetas— se
define en `src/styles/estilos.css` sobrescribiendo las variables CSS de Bootstrap, y se
importa después de Bootstrap para que gane.

## Pruebas

`npm test` levanta Karma, que abre Chrome sin ventana, ejecuta las pruebas de Jasmine y
genera el reporte de cobertura en `coverage/index.html`. El resumen se imprime al final
en la consola.

`npm run test:ver` corre las mismas pruebas en un Chrome visible y deja abierta la
página de Jasmine con cada `describe` e `it` en verde o en rojo. Karma queda vigilando:
al guardar un archivo vuelve a correr. Se cierra con Ctrl+C.

Las pruebas cubren los cinco tipos del enunciado: renderizado de listas, renderizado
condicional, propiedades, estado y eventos. Los mocks se hacen con `jasmine.createSpy`
(funciones falsas pasadas por props) y `spyOn` sobre `db` y `pago` (para no depender de
los datos reales).

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
| `test` | Se agregan o corrigen pruebas |
| `docs` | Documentación |
| `chore` | Configuración, estructura, tareas de mantenimiento |

## Flujo de trabajo

La rama `main` se mantiene siempre funcional. El trabajo se realiza en ramas por
funcionalidad y se integra mediante Pull Request.

```
feat/nombre-de-la-funcionalidad
fix/descripcion-del-error
docs/tema
```
