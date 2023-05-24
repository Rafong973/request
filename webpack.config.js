// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production'

const config = {
  entry: `./src/${isProduction ? 'index' : 'test'}.ts`,
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'index.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'tests')
    },
    compress: true,
    port: 9000
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './tests/index.html'
      })
    )
  }
  return config
}
