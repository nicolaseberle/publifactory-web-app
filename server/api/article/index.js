'use strict';

var express = require('express')
const articlesController = require('./article.controller');
const roles = require('../roles/roles.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', articlesController.getArticles);
router.get('/mine/:id', articlesController.getMyArticles);
router.get('/:id', articlesController.findArticleById);
router.post('/', articlesController.createArticle);

router.use('/:id', async function (req, res, next) {
  try {
    req.route = 'articleModify';
    await roles.doYouHaveThisRight(req, res, next);
  } catch (e) {
    res.status(401).json({ success: false, message: e.message });
  }
})

router.put('/:id', articlesController.findArticlebyIdAndUpdate);
router.put('/:id/authors', articlesController.updateAuthorOfArticle);
router.put('/:id/addAuthors', articlesController.addAuthorOfArticle);
router.put('/:id/removeAuthor', articlesController.removeAuthorOfArticle);
router.delete('/:id', articlesController.deleteArticle);

/*router.get('/:slug', articlesController.findArticleBySlug);
router.get('/draft/:slug', articlesController.findEditedArticleBySlug);
router.post('/', articlesController.createArticle);
router.put('/:slug', articlesController.findArticlebySlugAndUpdate);
router.delete('/:slug', articlesController.findArticleBySlugAndDelete);

router.put('/:slug/toggle', articlesController.findArticleBySlugAndTogglePublished);

router.get('/:slug/categories', articlesController.findArticleBySlugAndFetchCategories);
router.put('/:slug/categories', articlesController.findArticleBySlugAndAddCategoryBySlug);
router.delete('/:slug/categories', articlesController.findArticleBySlugAndRemoveCategoryBySlug);

router.get('/feed/:id', articlesController.getArticlesOfFollowedUsers);
router.get('/myfeed/:id', articlesController.getArticlesOfUser);
router.get('/:id/selectedArticles', articlesController.getSelectedArticles);
*/
module.exports = router;
