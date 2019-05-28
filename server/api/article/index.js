'use strict';

var express = require('express')
const articlesController = require('./article.controller');
const roles = require('../roles/roles.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', articlesController.createArticle);
router.get('/', articlesController.getArticles);
router.get('/mine/:id', articlesController.getMyArticles);

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'articleRead';
    await roles.doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})

router.get('/:id', articlesController.findArticleById);

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'articleModify';
    await roles.doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})

router.put('/:id', articlesController.findArticlebyIdAndUpdate);
router.put('/:id/authors', articlesController.updateAuthorOfArticle);
router.put('/:id/addAuthors', articlesController.addAuthorOfArticle);
router.put('/:id/removeAuthor', articlesController.removeAuthorOfArticle);
router.delete('/:id', articlesController.deleteArticle);

router.use('/:id/:status', async function (req, res, next) {
  try {
    req.route = req.params.status;
    await roles.doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
});

router.patch('/:id/:status(review|submit|publish)', articlesController.changeStatus);

module.exports = router;
