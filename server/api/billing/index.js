const express = require('express');
const controllers = require('./controllers');
const middlewares = require('../../middlewares/index');
const billingMiddlewares = require('./middlewares');
const router = express.Router();
const services = require('./services');
// Base route: '/api/billings'

// router.use(['/users/:userId',], billingMiddlewares.permissions);

router.get('/', middlewares.authentication, controllers.list);

router.post(
	['/users/:userId', '/journals/:journalId'],
	middlewares.authentication,
	billingMiddlewares.permissions,
	billingMiddlewares.canWrite,
	controllers.create
);

router.get(
	['/:userId/:billingId', '/:journalId/:billingId'],
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

// services.stripe.createCustomer();
// services.stripe.createProduct();
services.stripe.createPlan();
// services.stripe.incrementPlan();
module.exports = router;
