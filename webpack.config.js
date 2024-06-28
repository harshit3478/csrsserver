const path = require('path');
// const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      "net": false,
      "tls": false,
      "dns": false,
      "child_process": false,
    }
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
