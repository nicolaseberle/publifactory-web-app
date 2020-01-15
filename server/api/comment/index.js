'use strict';

const express = require('express');
const commentsController = require('./controllers');
const rolesArticle = require('../roles/article/roles.article.controller');

const router = express.Router();

router.use('/:id', async function(req, res, next) {
	try {
		req.route = 'comment';
		req.params.id = req.params.articleId;
		req.params.uuid = req.params.reviewId;
		await rolesArticle.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});

if (process.env.NODE_ENV === 'production') {
	router.get('/:id/:uuid?', commentsController.getComments);
	router.post('/:id', commentsController.createArticleComment);
	router.post('/:id/:uuid/answer', commentsController.answerComment);
	router.put('/:id/:uuid', commentsController.updateComment);
	router.put('/:id/:uuid/content', commentsController.updateCommentContent);
	router.delete('/:id/:uuid', commentsController.findCommentAndDelete);
} else {
	// Create or if reviewId ==> addChild(=>reply to review)
	router.post('/:articleId/:reviewId?', commentsController.create);
	router.get('/list/:articleId/', commentsController.list);
	router.get('/:reviewId/', commentsController.read);
	router.put('/:reviewId/', commentsController.update);
	router.delete('/:articleId/:reviewId', commentsController.remove);
}
module.exports = router;
