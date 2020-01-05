const merge = require('webpack-merge')
const common = require('./webpack.config')

module.exports =  merge(common, {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
  ],
  devServer: {
    contentBase: 'dist',
    host: '0.0.0.0',
    port: 4200,
    publicPath: '/',
    allowedHosts: [
        '.symlocal',
        'localhost'
    ],
  }
})
