const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// Base route: '/api/requests'

router.get('/', controllers.list);
router.post('/', controllers.create);
router.get('/:requestId', controllers.read);
router.patch('/:requestId', controllers.update);
router.delete('/:requestId', controllers.remove);
router.get(
	'/:requestId/:status(accepted|rejected|outfield)',
	controllers.reviewerResponse
);

router.get('/seen/:requestId', controllers.reviewerRead);

module.exports = router;
