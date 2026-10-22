/**
 * Botanik — Listado de articulos del blog.
 *
 * Una tarjeta por articulo de data/blogs.js. El boton lleva a /blogs/<id>.
 */

import { Link } from "react-router-dom";
import { BLOGS } from "../../data/blogs.js";
import { rutaImagen } from "../../services/formato.js";

export default function Blogs() {
  return (
    <div className="container py-4 py-lg-5">
      <section>
        <h1>Notas del vivero</h1>
        <p className="bt-bajada mt-3">Lo que aprendimos cultivando, escrito para que no tengas que matar una planta para descubrirlo.</p>
      </section>

      <section className="bt-seccion">
        <h2 className="visually-hidden">Articulos publicados</h2>
        <div className="row g-4">
          {BLOGS.map((blog) => (
            <div className="col-12 col-lg-6" key={blog.id}>
              <article className="bt-blog-tarjeta">
                <img className="bt-blog-img" src={rutaImagen(blog.imagen)} alt={blog.alt} />
                <div className="p-4">
                  <p className="bt-titulo-seccion mb-2">{blog.etiqueta} · {blog.lectura}</p>
                  <h3 className="h4">{blog.titulo}</h3>
                  <p className="text-body-secondary mt-3">{blog.resumen}</p>
                  <Link className="btn btn-outline-primary mt-2" to={"/blogs/" + blog.id}>Leer articulo</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
