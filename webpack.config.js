const path = require('path');
const webpack = require('webpack');

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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['@popperjs/core', 'default']
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.json$/,
        type: 'json'
      },
      {
        test: /\.md$/,
        use: 'null-loader'
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  mode: 'production'
};