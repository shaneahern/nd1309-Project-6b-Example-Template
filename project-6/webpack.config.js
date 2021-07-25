const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/app.js",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./style.css", to: "style.css" }]),
    new CopyWebpackPlugin([{ from: "./truffle.js", to: "truffle.js" }]),
    new CopyWebpackPlugin([{ from: "./src/js/truffle-contract.js", to: "js/truffle-contract.js" }]),
    new CopyWebpackPlugin([{ from: "./build/contracts", to: "build/contracts" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
