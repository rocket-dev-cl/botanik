/* Solo lo usa Karma: Vite compila el JSX por su cuenta en desarrollo. */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { chrome: "100" } }],
    ["@babel/preset-react", { runtime: "automatic" }]
  ]
};
