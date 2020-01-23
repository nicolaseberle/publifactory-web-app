/**
 * Main application routes
 */

'use strict';

const path = require('path');
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
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	// Insert routes below
	app.use('/api/users', require('./api/user'));
	app.use('/api/auth', require('./auth'));
	app.use('/api/invitations', require('./api/invitations'));

	// app.use(function(req, res, next) {
	// 	if (req.originalUrl.startsWith('/api/requests')) {
	// 		return next();
	// 	}
	// 	jwtCheck(req, res, next);
	// });

	app.use('/api/articles', jwtCheck, require('./api/article'));
	app.use('/api/journals', jwtCheck, require('./api/journal'));
	app.use('/api/comments', jwtCheck, require('./api/comment'));
	app.use('/api/global-reviews', jwtCheck, require('./api/global-review'));
	app.use('/api/data', jwtCheck, require('./api/data'));
	app.use('/api/figure', jwtCheck, require('./api/figure'));
	app.use('/api/converter', jwtCheck, require('./Converter'));
	app.use('/api/roles', jwtCheck, require('./api/roles'));
	app.use('/api/pictures', jwtCheck, require('./api/picture'));
	app.use('/api/history', jwtCheck, require('./api/article/history'));
	app.use('/api/requests', require('./api/request'));
	app.use('/api/publish-workflow', require('./api/publish-workflow'));

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		next({ code: 404, message: 'This route does not exist.' });
	});

	// error handling
	// next is mandatory because 4 args => error handling, 3 args => middleware
	app.use(function(err, req, res, next) {
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
