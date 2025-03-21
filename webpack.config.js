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
  resolve: {
    alias: {
      'jquery-slim': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.slim.min.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery-slim',
      jQuery: 'jquery-slim',
      'window.jQuery': 'jquery-slim',
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
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name].[ext]'
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  mode: 'production'
};