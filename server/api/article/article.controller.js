'use strict';

var User = require('../user/user.model');
var Article = require('./article.model');
var Data = require('../data/data.model');

var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
var _ = require('lodash')

var fs = require('fs')

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
    const articles = await Article.paginate({ deleted: false, published: true }, { page, limit,populate: 'authors.author reviewers',lean: true });
    console.log(JSON.stringify(articles, null, "\t"))
    renameObjectProperty(articles, 'docs', 'articles');

    return res.status(200).json(articles);
  } catch (err) {
    return next(err);
  }
};



/**
 * getArticles - Returns an array of articles requested with a page offset and limit,
 * so that results are paginated
 *
 * @function getMyArticles
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getMyArticles = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    console.log(req.params.id)
    const articles = await Article.paginate( { $or: [{ "authors.author": req.params.id },{ "reviewers": req.params.id }] }, { page, limit,populate: 'authors.author reviewers',lean: true });
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
    // console.log(JSON.stringify("findArticleById", null, "\t"))
    const article = await Article.findById(req.params.id).populate('authors.author reviewers').lean();
    // console.log(JSON.stringify(article, null, "\t"))
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
    // console.log(JSON.stringify("findArticlebyIdAndUpdate", null, "\t"))
    const title = req.body.title.trim();
    const abstract = req.body.abstract;
    const content = req.body.content;
    const arr_content = req.body.arr_content;
    const tags = req.body.tags;
    const published = req.body.published;
    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { title, abstract, content, arr_content, tags, published } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};
/**
 * @function deleteArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.deleteArticle = async (req, res, next) => {
  try {
    Article.findOneAndRemove({ _id: req.params.id }).exec();
    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
};


/**
 * @function updateAuthorOfArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.updateAuthorOfArticle = async (req, res, next) => {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    // console.log(JSON.stringify("findArticlebyIdAndUpdate", null, "\t"))

    const authors = req.body.authors;

    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { authors } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function addAuthorOfArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.addAuthorOfArticle = async (req, res, next) => {
  try {
    const author = await User.findOne({'email' : req.body.author.email}  ).exec();
    console.log(author)
    const newAuthor = {
      '_id': author._id,
      'rank': req.body.author.rank,
      'role': req.body.author.role,
      'author': author
    }
    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $push: { authors: newAuthor } },
        { new: true }
      );
    return res.status(200);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function removeAuthorOfArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.removeAuthorOfArticle = async (req, res, next) => {
  try {
    console.log(req.body.authorId)
    const authorToRemove = await User.findById( req.body.authorId  ).exec();
    console.log(authorToRemove)
    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { authors: { _id: authorToRemove._id } } },
        {multi: false}
      );
    return res.status(200);
  } catch (err) {
    return next(err);
  }
};
/**
 * @function createArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createArticle = async (req, res, next) => {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const arr_content = req.body.arr_content;
    const content = req.body.content;
    const status = req.body.status;
    const published = req.body.published;

    const newArticle = new Article({ title, abstract, content, arr_content, status, published});

    //Add category to the Article
    //Catch the good category
    //const category = await Category.findOne({ name: req.body.category }).lean();
    //console.log(JSON.stringify(category, null, "\t"));
    //newArticle.categories[0] = category;
    //const article = await newArticle.save();
    //console.log(JSON.stringify(category, null, "\t"));
    // console.log(JSON.stringify(req.body.id_author, null, "\t"));
    //Add Author to the Article
    const author = await User.findById( req.body.id_author ).exec();
    // console.log(JSON.stringify(author, null, "\t"));
    newArticle.authors[0] = {"rank":1,"role":"Lead","author":author};
    const article = await newArticle.save();

    // console.log(JSON.stringify(article._id, null, "\t"));

    return res.status(200).json(article._id);
  } catch (err) {
    return next(err);
  }
};
