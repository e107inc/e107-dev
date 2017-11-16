var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    './assets/js/background': './src/background',
    './assets/js/content': './src/content',
    './assets/js/popup': './src/popup'
  },

  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: '[name].js'
  },

  plugins: [
    // Provide translations plugin to interpolate translation arguments.
    new webpack.ProvidePlugin({
      translations: path.resolve('./config/translations'),
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          plugins: [
            'transform-runtime'
          ],
          presets: ['es2015', 'stage-0']
        },
        exclude: [
          path.resolve(__dirname, "node_modules"),
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
