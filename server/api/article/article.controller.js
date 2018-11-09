'use strict';

var User = require('../user/user.model');
var Article = require('./article.model');

var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
var _ = require('lodash')

var validationError = function (res, err) {
  return res.status(422).json(err)
}

/**
 * Get list of articles
 * restriction: 'admin'
 */

//const Category = require('../category/category.model');

//const ArticleValidator = require('./article.validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 * getArticles - Returns an array of articles requested with a page offset and limit,
 * so that results are paginated
 *
 * @function getArticles
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getArticles = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    const articles = await Article.paginate({ deleted: false, published: true }, { page, limit,populate: 'authors reviewers',lean: true });
    console.log(JSON.stringify(articles, null, "\t"))
    renameObjectProperty(articles, 'docs', 'articles');

    return res.status(200).json(articles);
  } catch (err) {
    return next(err);
  }
};

/**
 * getArticleBySlug - Returns an article requested by slug
 *
 * @function findArticleBySlug
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleById = async (req, res, next) => {
  try {
    console.log(JSON.stringify("findArticleById", null, "\t"))
    const article = await Article.findById(req.params.id).populate('authors reviewers').lean();
    console.log(JSON.stringify(article, null, "\t"))
    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};


/**
 * @function findArticleBySlugAndUpdate
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticlebyIdAndUpdate = async (req, res, next) => {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    console.log(JSON.stringify("findArticlebyIdAndUpdate", null, "\t"))
    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const content = req.body.content;
    const published = req.body.published;
    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { title, abstract, content, published } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};
