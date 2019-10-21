'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const helpers = require('./helpers');
const commonConfig = require('./webpack.config.common');
const environment = require('./env/dev.env');
const path = require('path');
const fs = require('fs');

const backendBase = {
	// Root path of server
	root: path.normalize(__dirname),

	// Server port
	port: process.env.PORT || 4000,

	socketPort: process.env.SOCKET_PORT || 4001,

	// Secret for session, you will want to change this and make it an environment variable
	secrets: {
		session: process.env.SECRET || 'publifactory-project-secret'
	},

	// List of user roles
	userRoles: ['admin', 'editor', 'user'],

	// MongoDB connection options
	mongo: {
		options: {
			db: {
				safe: true
			}
		}
	}
};

const webpackConfig = merge(commonConfig, {
	mode: 'development',
	devtool: 'source-map',
	output: {
		path: helpers.root('dist'),
		publicPath: '/',
		filename: 'js/[name].bundle.js',
		chunkFilename: 'js/[id].chunk.js'
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new webpack.EnvironmentPlugin(environment),
		new webpack.HotModuleReplacementPlugin(),
		new FriendlyErrorsPlugin()
	],
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: true,
		overlay: true,
		port: 9001,
		// host: process.env.SITE_IP,
		disableHostCheck: true,
		proxy: {
			'/api': {
				target: `http://${process.env.BASE_API}:${backendBase.port}`,
				changeOrigin: true,
				secure: false
			},
			'/static': { target: 'http://localhost:9001', pathRewrite: { '^/static': '/client/static' } },
			'/public': { target: 'http://localhost:9001', pathRewrite: { '^/public': '/client/public' } },
			'/socket.io': {
				target: `http://${process.env.BASE_API}:${backendBase.port}`,
				changeOrigin: true,
				ws: true
			},
			'/collaboration': {
				target: `http://${process.env.BASE_API}:${backendBase.port}`,
				changeOrigin: true,
				ws: true
			},
			'/mevn-dev': {
				target: 'http://api:' + backendBase.port + '/mevn-dev',
				changeOrigin: true,
				ws: true
			}
		},
		stats: { normale: true }
	}
});

module.exports = webpackConfig;
