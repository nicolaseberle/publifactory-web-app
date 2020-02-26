/**
 * Main application routes
 */

'use strict';

const path = require('path');
const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load(
	path.join(__dirname, './config/swagger.yaml')
);

const jwtCheck = require('./auth/jwt');
const error = require('./config/error');

/**
 * This function is used to make the route management.
 * @param app
 */
module.exports = function(app) {
	// Create documentation route
	app.use('/contents', express.static(`${__dirname}/contents`));

	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	// Insert routes below
	app.use('/api/users', require('./api/user'));
	app.use('/api/auth', require('./auth'));
	app.use('/api/invitations', require('./api/invitations'));

	/* Token is not necessary for those parts*/
	app.use('/api/requests', require('./api/request'));
	app.use('/api/activity', require('./api/activity'));
	app.use('/api/services', require('./api/services'));
	app.use('/api/journal-names', require('./api/journal-name'));

	app.use(function(req, res, next) {
		console.log('Ommit Connection for:', req.originalUrl);
		if (req.originalUrl.startsWith('/api/requests')) {
			return next();
		}
		jwtCheck(req, res, next);
	});

	app.use('/api/articles', require('./api/article'));
	app.use('/api/journals', require('./api/journal'));
	app.use('/api/comments', require('./api/comment'));
	app.use('/api/data', require('./api/data'));
	app.use('/api/figure', require('./api/figure'));
	app.use('/api/converter', require('./Converter'));
	app.use('/api/roles', require('./api/roles'));
	app.use('/api/pictures', require('./api/picture'));
	app.use('/api/history', require('./api/article/history'));
	app.use('/api/billings', require('./api/billing'));
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		next({ code: 404, message: 'This route does not exist.' });
	});

	// error handling
	// next is mandatory because 4 args => error handling, 3 args => middleware
	app.use(function(err, req, res, next) {
		if (process.env.NODE_ENV === 'development') console.log('ERROR::', err);
		try {
			if (err.constructor === error.ApiError) {
				return res
					.status(err.status)
					.json({ succes: false, message: err.message })
					.end();
			}
			res.status(err.code ? err.code : 500).json({
				success: false,
				message: err.message ? err.message : 'Something went wrong'
			});
		} catch (e) {
			return res.status(500).json({
				success: false,
				message: 'Unknown server error.'
			});
		}
	});
};
