'use strict';

const express = require('express');
const controllers = require('./controllers');
const rolesArticle = require('../roles/article/roles.article.controller');

const router = express.Router();

router.use('/:id', async function(req, res, next) {
	try {
		req.route = 'comment';
		req.params.id_article = req.params.articleId;
		req.params.id = req.params.articleId;
		req.params.uuid = req.params.partialReviewId;
		await rolesArticle.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});

// Create or if reviewId ==> addChild(=>reply to review) // TODO delete comment.controller.js
router.post('/:articleId/:partialReviewId?', controllers.create);
router.get('/list/:articleId/', controllers.list);
router.get('/:partialReviewId/', controllers.read);
router.put('/:partialReviewId/', controllers.update);
router.delete('/:articleId/:partialReviewId', controllers.remove);
module.exports = router;
