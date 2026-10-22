/**
 * Botanik — Pagina de la empresa.
 *
 * Contenido fijo. Los tres puntos de "Como trabajamos" y las fichas del equipo
 * se guardan en arreglos y se dibujan con .map(), para no repetir el marcado.
 */

const PRINCIPIOS = [
  {
    titulo: "Cultivo propio",
    texto: "La mayoria de las plantas del catalogo sale de nuestro invernadero, no de un intermediario. Sabemos que edad tienen y en que sustrato crecieron."
  },
  {
    titulo: "Ficha honesta",
    texto: "Cada producto declara luz, riego y si es apto para mascotas. Si una planta es dificil, lo decimos en la descripcion en vez de esconderlo."
  },
  {
    titulo: "Postventa",
    texto: "Si tu planta llega danada o no se adapta durante el primer mes, la reponemos. Escribenos desde la pagina de contacto."
  }
];

const EQUIPO = [
  {
    nombre: "Nicolas Navarrete",
    rol: "Base, administracion y compra",
    texto: "Fuente de datos, sesion, login y registro, checkout y el panel de administracion con sus mantenedores."
  },
  {
    nombre: "Camila Leiva",
    rol: "Tienda publica",
    texto: "Catalogo, categorias, ofertas, detalle de producto, carrito de compras y paginas de contenido."
  }
];

export default function Nosotros() {
  return (
    <div className="container py-4 py-lg-5">
      <section>
        <h1>Nosotros</h1>
        <p className="bt-bajada mt-3">Botanik nacio de una molestia concreta: comprar una planta y verla morir a las tres semanas sin saber por que.</p>
      </section>

      <section className="bt-seccion">
        <div className="row g-4 g-lg-5 align-items-center">
          <div className="col-12 col-lg-6">
            <h2>La tienda</h2>
            <p className="mt-3">Partimos en 2024 con un invernadero en Buin y un catalogo de doce especies. La regla desde el primer dia fue no vender nada que no supieramos mantener vivo nosotros mismos, y escribir en cada ficha cuanta luz necesita la planta y cada cuanto se riega.</p>
            <p>Hoy el catalogo tiene mas de cuarenta productos entre plantas de interior y exterior, maceteros, sustratos, fertilizantes y herramientas. Seguimos cultivando la mayor parte de las plantas que vendemos, y las que no, las compramos a viveros de la zona central que trabajan igual que nosotros.</p>
            <p className="mb-0">Despachamos a todo Chile en cajas disenadas para que la planta viaje de pie y llegue sin hojas quebradas.</p>
          </div>
          <div className="col-12 col-lg-6">
            <img className="bt-equipo-img" src="/img/ui/nosotros-1.jpg" alt="Invernadero de Botanik con plantas de interior en bandejas" />
          </div>
        </div>
      </section>

      <section className="bt-seccion pt-0">
        <h2>Conoce el invernadero</h2>
        <p className="bt-bajada mt-2 mb-4">Un recorrido de tres minutos por donde se cultivan las plantas que llegan a tu casa.</p>
        <div className="bt-video ratio ratio-16x9">
          <video controls preload="none" poster="/img/ui/nosotros-2.jpg">
            <source src="/img/ui/botanik-invernadero.mp4" type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      </section>

      <section className="bt-seccion pt-0">
        <h2>Como trabajamos</h2>
        <div className="row g-4 mt-1">
          {PRINCIPIOS.map((principio) => (
            <div className="col-12 col-md-4" key={principio.titulo}>
              <article>
                <h3 className="h5">{principio.titulo}</h3>
                <p className="text-body-secondary mb-0">{principio.texto}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="bt-seccion pt-0">
        <h2>El equipo de desarrollo</h2>
        <p className="bt-bajada mt-2 mb-4">Este sitio es el proyecto de la asignatura Desarrollo Fullstack II (DSY1104) de Duoc UC.</p>
        <div className="row g-4">
          {EQUIPO.map((persona) => (
            <div className="col-12 col-md-6" key={persona.nombre}>
              <article className="d-flex gap-3 align-items-start">
                <img className="rounded-circle" src="/img/ui/avatar.svg" alt="" width="64" height="64" />
                <div>
                  <h3 className="h5 mb-1">{persona.nombre}</h3>
                  <p className="text-body-secondary small mb-2">{persona.rol}</p>
                  <p className="mb-0">{persona.texto}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
