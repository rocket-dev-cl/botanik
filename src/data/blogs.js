/**
 * Botanik — Articulos del blog.
 *
 * En la entrega 1 cada articulo era un HTML propio (blog-1.html, blog-2.html).
 * En React se guardan como datos y una sola pagina, BlogDetalle, los muestra
 * segun el id de la URL: agregar un tercer articulo es agregar un objeto aca,
 * no copiar una pagina.
 *
 * Esquema:
 *   {
 *     id:          "riego-excesivo",  // va en la URL: /blogs/riego-excesivo
 *     etiqueta:    "Cuidados",
 *     lectura:     "8 min de lectura",
 *     titulo:      "",
 *     resumen:     "",                // texto de la tarjeta en el listado
 *     bajada:      "",                // texto bajo el titulo en el articulo
 *     imagen:      "img/blog/...",
 *     alt:         "",
 *     pie:         "",                // pie de foto
 *     secciones:   [ { titulo: "", parrafos: [""], pasos: [""] } ]
 *   }
 */

export const BLOGS = [
  {
    id: "riego-excesivo",
    etiqueta: "Cuidados",
    lectura: "8 min de lectura",
    titulo: "La mayoria de las plantas de interior muere ahogada, no de sed",
    resumen: "Regar cada domingo suena responsable y es la forma mas rapida de pudrir una raiz. Como leer el sustrato en vez del calendario.",
    bajada: "Regar cada domingo suena responsable. Es, en la practica, la forma mas rapida de pudrir una raiz.",
    imagen: "img/blog/blog-1.jpg",
    alt: "Manos revisando la humedad del sustrato de una planta de interior",
    pie: "Revisar el sustrato con el dedo sigue siendo mas confiable que cualquier calendario.",
    secciones: [
      {
        titulo: "El calendario es el problema",
        parrafos: [
          "Cuando alguien nos escribe porque su planta se puso amarilla, la primera pregunta no es cuanto la riega, sino cada cuanto. Casi siempre la respuesta es un dia fijo de la semana. Y ahi esta el error: la planta no consume agua a un ritmo constante. En enero, con treinta grados y la ventana abierta, una monstera puede secar su sustrato en cuatro dias. En julio, en la misma casa, esa misma maceta puede tardar tres semanas.",
          "Regar por calendario significa que durante medio ano estas echando agua sobre tierra que todavia esta mojada. La raiz queda sin aire, y una raiz sin aire se pudre."
        ]
      },
      {
        titulo: "Por que se confunde con falta de agua",
        parrafos: [
          "Aca esta la trampa que hace que el problema se agrave: una planta con las raices podridas no puede absorber agua. Las hojas se ponen blandas, caidas y amarillas, exactamente igual que una planta sedienta. El reflejo natural es regar mas. Y con eso se termina de matar.",
          "La forma de distinguirlos es mirar el sustrato, no la hoja. Si la hoja esta caida y la tierra esta seca al tacto varios centimetros hacia abajo, falta agua. Si la hoja esta caida y la tierra sigue humeda, sobra."
        ]
      },
      {
        titulo: "Como revisar antes de regar",
        parrafos: [
          "Mete el dedo en el sustrato hasta la segunda falange. Si sale con tierra pegada y se siente fresco, no riegues. Si sale limpio y seco, riega. Es poco elegante y funciona mejor que los medidores de humedad baratos, que suelen leer la conductividad de las sales del sustrato y no el agua.",
          "Un segundo metodo, util para macetas grandes: levantar la maceta. Una maceta recien regada pesa notoriamente mas que la misma maceta seca. Con dos o tres repeticiones aprendes a reconocer el peso de cada planta."
        ]
      },
      {
        titulo: "Que hacer si ya paso",
        parrafos: [
          "Si sospechas de pudricion, saca la planta de la maceta y mira las raices. Una raiz sana es firme y clara, entre blanca y crema. Una raiz podrida es cafe oscura, blanda, y se deshace entre los dedos con un olor agrio caracteristico.",
          "Corta con tijera limpia todo lo que este blando, hasta llegar a tejido firme. Deja que la planta se oree un par de horas y replantala en sustrato nuevo y seco, en una maceta con drenaje. No riegues por una semana: la raiz cortada necesita cicatrizar antes de volver a estar en contacto con agua."
        ]
      },
      {
        titulo: "Lo que si ayuda",
        parrafos: [
          "Un sustrato que drene. Si el agua queda estancada en la superficie o tarda mucho en salir por abajo, el problema no es cuanto riegas sino en que esta plantada. Un sustrato universal mezclado con perlita o corteza soluciona la mayor parte de los casos.",
          "Y una maceta con orificio. Un macetero decorativo sin drenaje es una pecera: el agua que entra no tiene por donde salir. Si te gusta el macetero cerrado, usalo como cachepot y deja la planta en su maceta plastica adentro."
        ]
      }
    ]
  },
  {
    id: "riego-por-inmersion",
    etiqueta: "Tecnica",
    lectura: "6 min de lectura",
    titulo: "Riego por inmersion: por que la planta bebe mejor desde abajo",
    resumen: "Un metodo que resuelve el sustrato apelmazado, los mosquitos del sustrato y las hojas manchadas, con un balde y quince minutos.",
    bajada: "Un balde, quince minutos y se acaban tres problemas a la vez: el sustrato apelmazado, los mosquitos y las hojas manchadas.",
    imagen: "img/blog/blog-2.jpg",
    alt: "Maceta plastica sumergida parcialmente en un recipiente con agua",
    pie: "La maceta se sumerge hasta la mitad, nunca hasta cubrir la superficie del sustrato.",
    secciones: [
      {
        titulo: "Que problema resuelve",
        parrafos: [
          "Cuando un sustrato lleva mucho tiempo en la misma maceta se compacta, y la turba seca se vuelve hidrofoba: repele el agua en vez de absorberla. Si riegas desde arriba, el agua encuentra el camino mas rapido por los costados de la maceta, sale por el orificio, y te deja la sensacion de haber regado. La tierra del centro sigue seca.",
          "La inmersion invierte el recorrido. El agua sube por capilaridad desde abajo y moja el sustrato de manera pareja, incluido el nucleo que el riego superficial no alcanza."
        ]
      },
      {
        titulo: "Como se hace",
        pasos: [
          "Llena un recipiente con agua a temperatura ambiente hasta unos diez centimetros. Un balde, una fuente o el lavaplatos sirven.",
          "Pon la maceta dentro, sin su plato. El agua debe llegar como maximo a la mitad de la altura de la maceta.",
          "Espera entre diez y veinte minutos. Vas a ver como la superficie del sustrato se oscurece: esa es la senal de que el agua llego arriba.",
          "Saca la maceta y dejala escurrir en el lavaplatos o sobre una rejilla hasta que deje de gotear.",
          "Recien entonces devuelvela a su plato o a su macetero decorativo."
        ]
      },
      {
        titulo: "Cuando conviene y cuando no",
        parrafos: [
          "Funciona muy bien en plantas de hoja delicada que se manchan con el agua encima, como las calatheas, y en helechos, que agradecen un sustrato uniformemente humedo. Tambien es la mejor forma de rehidratar una planta que llevaba semanas olvidada.",
          "No conviene en suculentas y cactus, que prefieren un riego corto y un secado rapido. Tampoco en plantas con sospecha de pudricion: ahi lo que sobra es agua, no falta."
        ]
      },
      {
        titulo: "El efecto sobre los mosquitos del sustrato",
        parrafos: [
          "Esos mosquitos pequenos que aparecen alrededor de las macetas ponen sus huevos en los primeros centimetros de tierra humeda. Al regar desde abajo, la superficie se mantiene seca mas tiempo y el ciclo se corta sin necesidad de insecticida.",
          "No es magia ni funciona de un dia para otro: toma dos o tres riegos. Pero es la solucion mas simple y la unica que no implica echarle quimicos a una planta que vas a tener adentro de la casa."
        ]
      }
    ]
  }
];
