const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.d.ts'],
    alias: {
      'three': path.resolve('./node_modules/three'),
    },
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "crypto": false,
      "buffer": require.resolve("buffer/")
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      cwd: process.cwd(),
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        compilation.errors.push(new Error(paths.join(' -> ')))
      },
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  mode: 'development',
  ignoreWarnings: [
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/chunk-HPIYOMRJ.js/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/chunk-HPIYOMRJ.js/,
      message: /Critical dependency: Accessing import.meta directly is unsupported/,
    },
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/chunk-PP44P6WK.js/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/twsearch-6KUSKPX2.js/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/inside-XY43FEWJ.js/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
    {
      module: /node_modules\/cubing\/dist\/lib\/cubing\/chunks\/lazy_recursive-61c80.js/,
      message: /Circular dependency between chunks with runtime/,
    },
  ],
};
