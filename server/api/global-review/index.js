const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// Base route: '/api/global-review'

router.post('/:articleId/', controllers.create);
router.get('/list/:articleId/', controllers.list);
router.get('/:globalReviewId/', controllers.read);
router.put('/:globalReviewId/', controllers.update);
router.delete('/:articleId/:globalReviewId', controllers.remove);

module.exports = router;
