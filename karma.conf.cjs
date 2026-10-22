/**
 * Botanik — Entorno de pruebas unitarias.
 *
 * Karma abre un Chrome sin ventana, carga las pruebas empaquetadas por webpack y
 * Jasmine las ejecuta. babel-plugin-istanbul instrumenta el codigo de src/ para
 * medir la cobertura, que queda en coverage/index.html y se resume en consola.
 *
 * npm run test:ver abre un Chrome visible y deja la pagina de Jasmine con el
 * resultado de cada prueba (reporter kjhtml); se cierra con Ctrl+C.
 */
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      { pattern: "src/**/*.spec.jsx", watched: false },
      // Las imagenes se sirven para que los componentes no generen 404 en consola.
      { pattern: "public/img/**/*", included: false, served: true, watched: false }
    ],

    proxies: { "/img/": "/base/public/img/" },

    preprocessors: { "src/**/*.spec.jsx": ["webpack"] },

    webpack: {
      mode: "development",
      stats: "errors-only",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                plugins: [["istanbul", { exclude: ["**/*.spec.jsx", "src/data/**"] }]]
              }
            }
          },
          { test: /\.css$/, use: "null-loader" }
        ]
      }
    },

    reporters: ["progress", "coverage"],

    // Deja visible el reporte de Jasmine en el navegador al terminar.
    client: { clearContext: false },

    coverageReporter: {
      dir: "coverage/",
      reporters: [
        { type: "html", subdir: "." },
        { type: "text-summary" }
      ]
    },

    // Solo se muestran los errores del navegador, no los avisos de librerias.
    browserConsoleLogOptions: { level: "error", terminal: true },

    browsers: ["ChromeHeadless"],
    singleRun: true
  });
};
