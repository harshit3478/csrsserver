const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = {
  // Entry point of your application
  entry: './index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  resolve: {
    alias: {
      "node-fetch": "node-fetch/browser",
    },
    fallback: {
      net: false,
      tls: false,
      dns: false,
      child_process: false,
    },
  },

  plugins: [
    new NodePolyfillPlugin(),
  ],
  // Module rules for handling different file types
  module: {
    rules: [
        {
            test: /yaml/,
            use: 'ignore-loader'
          },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Rules for other file types can be added here
    ],
  },

  // Development tools
  devtool: 'source-map', // Enable source maps for debugging

  // Development server configuration
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};