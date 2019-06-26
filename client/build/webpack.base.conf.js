var path = require('path')
var config = require('../../server/config').frontend
var vueLoaderConfig = require('./vue-loader.conf')
var utils = require('./utils')
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}

module.exports = {
  entry: {
    app: '../src/main.js'
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [resolve('src'), resolve('../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'locales': resolve('src/locales'),
      'shared': resolve('src/shared'),
      'resources': resolve('src/resources')
    }
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.js$/,
        loader: 'ify-loader'
      }
    ]
  }
}
