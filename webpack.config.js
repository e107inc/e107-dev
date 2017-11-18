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
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          plugins: [
            'transform-runtime',
            'transform-class-properties'
          ],
          presets: ['es2015', 'stage-0']
        },
        exclude: [
          path.resolve(__dirname, "node_modules"),
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
