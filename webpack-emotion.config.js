const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: dev ? 'development' : 'production',
  devtool: 'source-map',
  entry: {
    'app-emotion': './src-emotion/App',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  optimization: { noEmitOnErrors: true },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
    new HtmlWebpackPlugin({
      filename: 'emotion.html',
      title: 'emotion benchmark',
      template: path.resolve(__dirname, 'src/template.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { plugins: ['emotion'] },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    publicPath: '/dist/',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8080,
  },
};
