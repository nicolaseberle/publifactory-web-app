'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config.js').frontend
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const helpers = require('./helpers')
const commonConfig = require('./webpack.config.common')
const isProd = process.env.NODE_ENV !== 'develoment'
const environment = isProd ? require('./env/prod.env') : require('./env/staging.env')
const CopyPlugin = require('copy-webpack-plugin')

const { env } = require('../config.js')

const webpackConfig = merge(commonConfig, {
  mode: 'production',
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: 'js/[hash].js',
    chunkFilename: 'js/[id].[hash].chunk.js'
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true }}]
        }
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: !isProd
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        element: {
          test: /[\\/]node_modules\/element-ui[\\/]/,
          name: 'element',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin(environment),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': `"${env}"`,
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new MiniCSSExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    }),
    new HtmlWebpackPlugin({
      filename: config.index,
      template: 'client/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks: ['manifest', 'vendor', 'element', 'app'],
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin

      chunksSortMode: function (a, b) {
        var orders = ['manifest', 'vendor', 'element', 'app']
        var order1 = orders.indexOf(a.names[0])
        var order2 = orders.indexOf(b.names[0])
        if (order1 > order2) {
          return 1
        } else if (order1 < order2) {
          return -1
        } else {
          return 0
        }
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyPlugin([
      { from: helpers.root('client/static/img'), to: '../dist/static/img' },
      { from: helpers.root('client/static/images'), to: '../dist/static/images' },
      { from: helpers.root('client/static/icons'), to: '../dist/static/icons' },
      { from: helpers.root('client/static/Default.png'), to: '../dist/static' },
      { from: helpers.root('client/static/css/katex.css'), to: '../dist/static/css/' },
      { from: helpers.root('client/static/css/codemirror.css'), to: '../dist/static/css/' }
    ])

  ]
})

if (!isProd) {
  webpackConfig.devtool = 'source-map'

  if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
}

module.exports = webpackConfig
