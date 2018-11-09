'use strict';

var express = require('express')
const articlesController = require('./article.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()


router.get('/', articlesController.getArticles);
router.get('/:id', articlesController.findArticleById);
router.put('/:id', articlesController.findArticlebyIdAndUpdate);
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
