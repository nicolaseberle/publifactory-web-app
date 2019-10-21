'use strict';

var express = require('express')
const commentsController = require('./comment.controller');
const rolesArticle = require('../roles/article/roles.article.controller');

var router = express.Router()

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'comment';
    await rolesArticle.doYouHaveThisRight(req, res, next);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/:uuid?', commentsController.getComments);
router.post('/:id', commentsController.createArticleComment);
router.post('/:id/:uuid/answer', commentsController.answerComment);
router.put('/:id/:uuid', commentsController.updateComment);
router.put('/:id/:uuid/content', commentsController.updateCommentContent);
router.delete('/:id/:uuid', commentsController.findCommentAndDelete);

module.exports = router;
