'use strict';

var express = require('express')
const commentsController = require('./comment.controller');

var router = express.Router()

router.get('/:id/comments', commentsController.getArticleComments);
router.get('/:id/comment/:uuid', commentsController.getArticleComment);
router.post('/:id/comment', commentsController.createArticleComment);
router.post('/:id/comment/:uuid/answer', commentsController.answerComment);
router.put('/:id/comments/:uuid', commentsController.updateComment);
router.put('/:id/comments/:uuid/content', commentsController.updateCommentContent);
router.delete('/:id/comments/:uuid', commentsController.findCommentAndDelete);

module.exports = router;
