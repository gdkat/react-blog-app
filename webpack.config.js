const path = require("path");

module.exports = {
  entry: "./src/App.jsx",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "bundled.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "src"),
    hot: true,
    historyApiFallback: { index: "index.html" },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "12" } }],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
