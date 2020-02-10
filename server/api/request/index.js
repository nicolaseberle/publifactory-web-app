const express = require('express');
const controllers = require('./controllers');
const router = express.Router();
const middlewares = require('../../middlewares');
// Base route: '/api/requests'

router.get('/', middlewares.authentication, controllers.list);
router.get('/totalRequest', controllers.totalRequest);
router.get('/logo', controllers.logo);
router.post('/:billingId', middlewares.authentication, controllers.create);
router.get('/:requestId', controllers.read);
router.patch('/:requestId', controllers.update);
router.delete('/:requestId', controllers.remove);
router.post(
	'/:requestId/:status(accepted|rejected|outfield|unsubscribed)',
	controllers.reviewerResponse
);
router.post('/remind/:requestId', controllers.remind);
router.get('/seen/:requestId', controllers.reviewerRead);

module.exports = router;
