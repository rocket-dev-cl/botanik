import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <section className="bt-seccion">
      <div className="container text-center bt-vacio">
        <h1>No encontramos esa pagina</h1>
        <p>Puede que el enlace este mal escrito o que la pagina ya no exista.</p>
        <Link className="btn btn-primary" to="/">Volver al inicio</Link>
      </div>
    </section>
  );
}
