const express = require('express');
const controllers = require('./controllers');
const middlewares = require('../../middlewares/index');
const billingMiddlewares = require('./middlewares');
const router = express.Router();

// Base route: '/api/billings'

router.get('/', middlewares.authentication, controllers.list);

router.post(
	['/users/:userId', '/journals/:journalId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.create
);

router.get(
	['/users/:userId/:billingId', '/journals/:journalId/:billingId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canRead,
	controllers.read
);

router.patch(
	['/:userId/:billingId', '/:journalId/:billingId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.update
);

router.delete(
	['/:userId/:billingId', '/:journalId/:billingId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.remove
);

// 'subscribe'
router.post(
	['/upgrade/:userId/:billingId', '/upgrade/:journalId/:billingId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.upgradePlan
);

router.post(
	['/unsubscribe/:userId/:billingId', '/unsubscribe/:journalId/:billingId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.unsubscribe
);

router.post(
	'/request-upgrade/:journalId/',
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canRead,
	controllers.requestUpgrade
);

router.get('/publicKey', middlewares.authentication, controllers.publicKey);

module.exports = router;
