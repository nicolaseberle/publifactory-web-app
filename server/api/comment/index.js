'use strict';

var express = require('express')
const commentsController = require('./comment.controller');

var router = express.Router()

router.get('/:id/comments', commentsController.getArticleComments);
// router.get('/:id/comments/:id', commentsController.findComment);
router.post('/:id/comments', commentsController.createArticleComment);
router.put('/:id/comments/:uuid', commentsController.updateScores);
// router.put('/:id/comments/:id', commentsController.findCommentAndUpdate);
// router.delete('/:id/comments/:id', commentsController.findCommentAndDelete);

module.exports = router;
