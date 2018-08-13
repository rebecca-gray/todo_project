const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      include: /flexboxgrid/
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
          options: { minimize: true }
        }
      ]
    }
    ]
  },
  resolve: {
    extensions: [".jsx", ".json", ".js"]
  },
  // entry: ['whatwg-fetch'],
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};