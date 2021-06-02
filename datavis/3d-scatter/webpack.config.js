const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {
  const isProduction = env === 'production' ? true : false;

  const plugins = [
    new webpack.DefinePlugin({
      __DEV__: false
    }),
    new CopyWebpackPlugin(
      [
        {
          from: 'app/data',
          to: 'data/'
        }
      ]
    ),
    new HtmlWebpackPlugin(
      {
        template: './app/index.html'
      }
    )
  ];

  if (isProduction) {
    plugins.concat(
      [
        new CleanWebpackPlugin(
          ['dist'],
          {
            root: __dirname
          }
        ),
        new UglifyJsPlugin({
          test: /\.js($|\?)/i,
          ecma: 6,
          sourceMap: true
        })
      ]
    );
  }

  return {
    entry: './app/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    devtool: "source-map",
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'es2016']
        }
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }]
    },
    plugins: plugins
  };
}
