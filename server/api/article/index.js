'use strict';

var express = require('express')
const articlesController = require('./article.controller');
const rolesArticle = require('../roles/article/roles.article.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', articlesController.createArticle);
router.get('/', articlesController.getArticles);
router.get('/mine', articlesController.getMyArticles);

router.use('/:id/:status', async function (req, res, next) {
  try {
    req.route = req.params.status;
    await rolesArticle.doYouHaveThisRight(req, res, next);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/:status(review|submit|publish)', articlesController.changeStatus);

router.use('/:id/addReviewer', async function (req, res, next) {
  try {
    req.route = 'inviteReviewer'
    await rolesArticle.doYouHaveThisRight(req, res, next)
  } catch (e) {
    next(e);
  }
})

router.put('/:id/addReviewer', articlesController.addReviewer);
router.put('/:id/addAssociateEditor', rolesArticle.inviteAe, articlesController.addAssociateEditor);

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'articleRead';
    await rolesArticle.doYouHaveThisRight(req, res, next);
  } catch (e) {
    next(e);
  }
})

router.get('/:id', articlesController.findArticleById);

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'articleModify';
    await rolesArticle.doYouHaveThisRight(req, res, next);
  } catch (e) {
    next(e);
  }
});

router.post('/:id/version', articlesController.createVersion);
router.put('/:id', articlesController.findArticlebyIdAndUpdate);
router.put('/:id/addAuthors', articlesController.addAuthorOfArticle);
router.put('/:id/removeAuthor', articlesController.removeAuthorOfArticle);
router.patch('/:id/authorRights', articlesController.updateAuthorRights);
router.delete('/:id', articlesController.deleteArticle);

module.exports = router;
