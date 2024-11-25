const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');

module.exports = {
  entry: "./src/components.jsx", // Path to your main JSX file
  output: {
    path: path.resolve(__dirname, "src", "public"),
    filename: "components.js", // Output filename
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env), // or provide specific env variables if needed
    }),
  ],
}
