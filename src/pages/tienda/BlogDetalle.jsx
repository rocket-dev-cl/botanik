/**
 * Botanik — Un articulo del blog.
 *
 * En la entrega 1 eran dos HTML (blog-1 y blog-2). Ahora es una sola pagina
 * que busca el articulo por el id de la URL y lo dibuja desde los datos.
 */

import { Link, useParams } from "react-router-dom";
import { BLOGS } from "../../data/blogs.js";
import { rutaImagen } from "../../services/formato.js";

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = BLOGS.find((item) => item.id === id);

  if (!blog) {
    return (
      <div className="container py-5">
        <div className="bt-vacio">
          <h1 className="h4">No encontramos ese articulo</h1>
          <Link className="btn btn-primary" to="/blogs">Volver a las notas</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="Ruta de navegacion">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{blog.titulo}</li>
        </ol>
      </nav>

      <article className="bt-articulo">
        <header>
          <p className="bt-titulo-seccion mb-2">{blog.etiqueta} · {blog.lectura}</p>
          <h1>{blog.titulo}</h1>
          <p className="bt-bajada mt-3">{blog.bajada}</p>
        </header>

        <figure className="my-4">
          <img className="bt-blog-portada" src={rutaImagen(blog.imagen)} alt={blog.alt} />
          <figcaption className="form-text mt-2">{blog.pie}</figcaption>
        </figure>

        {blog.secciones.map((seccion) => (
          <section key={seccion.titulo}>
            <h2 className="h4 mt-4">{seccion.titulo}</h2>
            {seccion.parrafos && seccion.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
            {seccion.pasos && (
              <ol>
                {seccion.pasos.map((paso) => <li className="mb-2" key={paso}>{paso}</li>)}
              </ol>
            )}
          </section>
        ))}

        <footer className="mt-5 pt-4 border-top">
          <Link className="btn btn-outline-primary" to="/blogs">Volver a las notas</Link>
        </footer>
      </article>
    </div>
  );
}
