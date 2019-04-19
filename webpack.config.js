const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'dev';

const config = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval' : 'source-map',

  entry: './src/index.js',

  output: {
    filename: 'assets/js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: [':data-src'],
              minimize: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './src/public',
        to: '.',
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
      minify: !IS_DEV && {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new PreloadWebpackPlugin({
      include: 'initial',
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
    minimizer: [],
  },
};

if (!IS_DEV) {
  const TerserWebpackPlugin = require('terser-webpack-plugin');
  // const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

  config.optimization.minimizer.push(
    new TerserWebpackPlugin(),
    // new OptimizeCSSAssetsWebpackPlugin({})
  );
}

module.exports = config;
