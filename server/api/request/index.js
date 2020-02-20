const express = require('express');
const controllers = require('./controllers');
const router = express.Router();
const middlewares = require('../../middlewares');
const requestMiddlewares = require('./middlewares');

// Base route: '/api/requests'

router.get(
	'/',
	middlewares.authentication,
	// requestMiddlewares.permissions,
	// requestMiddlewares.canRead,
	controllers.list
);

router.get(
	'/:requestId',
	middlewares.authentication,
	requestMiddlewares.permissions,
	requestMiddlewares.canRead,
	controllers.read
);
router.patch(
	'/:requestId',
	middlewares.authentication,
	//requestMiddlewares.permissions,
	//requestMiddlewares.canWrite,
	controllers.update
);
router.delete(
	'/:requestId',
	middlewares.authentication,
	requestMiddlewares.permissions,
	requestMiddlewares.canWrite,
	controllers.remove
);

router.post(
	'/send/:requestId',
	middlewares.authentication,
	//requestMiddlewares.permissions,
	//requestMiddlewares.canWrite,
	controllers.sendInvitation
);
router.post(
	'/remind/:requestId',
	middlewares.authentication,
	requestMiddlewares.permissions,
	requestMiddlewares.canWrite,
	controllers.remind
);

router.get('/totalRequest', controllers.totalRequest);
router.get('/logo', controllers.logo);
router.post('/:billingId', middlewares.authentication, controllers.create);
router.post(
	'/:requestId/:status(accepted|rejected|outfield|unsubscribed)',
	controllers.reviewerResponse
);
router.get('/seen/:requestId', controllers.reviewerRead);

module.exports = router;
