'use strict';

const path = require('path')
const config = require('../config.js').frontend
const VueLoaderPlugin      = require('vue-loader/lib/plugin');
const HtmlPlugin           = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
var vueLoaderConfig = require('./vue-loader.conf')
const helpers              = require('./helpers');
// const utils = require('./utils')
const isDev                = process.env.NODE_ENV === 'development';

function resolve (dir) {
  return path.join(__dirname, '../client/', dir)
}

function assetsPath (_path) {
  var assetsSubDirectory = config.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

const webpackConfig = {
    entry: {
        polyfill: '@babel/polyfill',
        main: helpers.root('client/src', 'main'),
    },
    resolve: {
        extensions: [ '.js', '.vue', '.json' ],
	      modules: [resolve('src'), resolve('../node_modules')],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js'
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
          		  name: assetsPath('img/[name].[hash:7].[ext]')
          		  }
	          },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ helpers.root('client/src'), resolve('../node_modules/vue-awesome'), resolve('../node_modules/vue-spinner/') ]
            },/*
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: vueLoaderConfig
            },*/
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [ helpers.root('client/src') ],
                exclude:  /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-spinner\//
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
              query: {
                limit: 10000,
                name: assetsPath('fonts/[name].[hash:7].[ext]')
              }
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        //new HtmlPlugin({ template: 'index.html', chunksSortMode: 'dependency' })
      	new HtmlPlugin({
      	    filename: 'index.html',
      	    template: 'client/index.html',
      	    inject: true
      	})
    ]
};

module.exports = webpackConfig;
