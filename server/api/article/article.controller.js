'use strict';

var User = require('../user/user.model');
var Article = require('./article.model');
const RolesArticle = require('../roles/article/roles.article.model');
var Data = require('../data/data.model');
const Journal = require('../journal/journal.model')
const RolesJournal = require('../roles/journal/roles.journal.model')

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

exports.getArticles = async function (req, res, next) {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  try {
    const articles = await Article.paginate({ deleted: false, published: true }, { page, limit,populate: 'authors.author reviewers',lean: true });
    renameObjectProperty(articles, 'docs', 'articles');
    return res.json(articles);
  } catch (err) {
    next(err);
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

exports.getMyArticles = async function (req, res, next) {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  try {
    const articles = await Article.paginate( { $or: [{ "authors.author": req.decoded._id },{ "reviewers": req.decoded._id }] }, { page, limit,populate: 'authors.author reviewers',lean: true });
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
module.exports.findArticleById = async function (req, res, next) {
  try {
    // console.log(JSON.stringify("findArticleById", null, "\t"))
    const article = await Article.findById(req.params.id).populate('authors.author reviewers').lean();
    // console.log(JSON.stringify(article, null, "\t"))
    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};


/**
 * @function findArticleBySlugAndUpdate
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticlebyIdAndUpdate = async function  (req, res, next) {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    // console.log(JSON.stringify("findArticlebyIdAndUpdate", null, "\t"))
    if (req.body.title === undefined || req.body.abstract === undefined || req.body.arr_content === undefined ||
      req.body.content === undefined || req.body.status === undefined || req.body.published === undefined ||
      req.body.tags === undefined)
      throw { code: 422, message: 'Missing parameters.'}
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

    return res.json(article);
  } catch (err) {
    return next(err);
  }
};


// #NO TESTED

/**
 * @function findArticlebyIdAndUpdateReferences
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticlebyIdAndUpdateReferences = async function  (req, res, next) {
  try {
    if (req.body.title === undefined )
      throw { code: 422, message: 'Missing parameters.'}
    const references = req.body.references;
    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { references } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.json(article);
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
module.exports.deleteArticle = async function (req, res, next) {
  try {
    Article.findOneAndRemove({ _id: req.params.id }).exec();
    res.sendStatus(204);
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
module.exports.updateAuthorOfArticle = async function (req, res, next) {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    // console.log(JSON.stringify("findArticlebyIdAndUpdate", null, "\t"))
    if (req.body.authors === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const authors = req.body.authors;

    const article = await Article
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { authors } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.json(article);
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
module.exports.addAuthorOfArticle = async function (req, res, next) {
  try {
    if (req.body.author === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const author = await User.findOne({ 'email' : req.body.author.email }).exec();
    const newAuthor = {
      '_id': author._id,
      'rank': req.body.author.rank,
      'role': req.body.author.role,
      'author': author
    }
    await Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { authors: newAuthor } },
        { new: true }
        );
    new RolesArticle({ id_user: author._id, id_article: req.params.id, right: 'author' }).save();
    return res.status(201).json({success: true});
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
module.exports.removeAuthorOfArticle = async function (req, res, next) {
  try {
    if (req.body.authorId === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    await Article.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { authors: { _id: req.body.authorId } } },
        {multi: false}
      );
    const query = { id_user: req.body.authorId, id_article: req.params.id };
    const toReplace = { $set: { right: "guest" } };
    await RolesArticle.updateOne(query, toReplace);
    res.status(204);
  } catch (err) {
    next(err);
  }
};
/**
 * @function createArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createArticle = async function (req, res, next) {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    if (req.body.title === undefined || req.body.abstract === undefined || req.body.arr_content === undefined ||
      req.body.content === undefined || req.body.status === undefined || req.body.published === undefined)
      throw { code: 422, message: 'Missing parameters.'}
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
    const author = await User.findById( req.decoded._id ).exec();
    // console.log(JSON.stringify(author, null, "\t"));
    newArticle.authors[0] = {"rank":1,"role":"Lead","author":author};
    const article = await newArticle.save();
    new RolesArticle({ id_user: req.decoded._id, id_article: article._id, right: 'author' }).save();

    // console.log(JSON.stringify(article._id, null, "\t"));

    res.status(201).json(article._id);
  } catch (err) {
    next(err);
  }
};

module.exports.changeStatus = async function (req, res, next) {
  try {
    const query = { _id: req.params.id };
    let status;
    if (req.params.status === 'review')
      status = { status: 'Reviewing' };
    else if (req.params.status === 'submit')
      status = { status: 'Submited' };
    else
      status = { status: 'Published' };
    const toReplace = { $set: status };
    await Article.updateOne(query, toReplace, function (err, data) {
      if (err) throw err;
    })
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports.updateAuthorRights = async function (req, res, next) {
  try {
    if (req.body.newAuthors === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const query = { _id: req.params.id };
    const toReplace = { $set: { authors: req.body.newAuthors } };
    await Article.updateOne(query, toReplace);
    res.status(201).json({ success: true })
  } catch (e) {
    console.error('UPDATE RIGHTS')
    console.error(e);
    next(e);
  }
};

module.exports.addReviewer = async function (req, res, next) {
  try {
    if (req.body.reviewer === undefined)
      throw { success: false, message: 'Missing parameters in body field.' };
    const user = await User.findOne({ email: req.body.reviewer.email }).exec();
    const query = { _id: req.params.id };
    const toAdd = { $push: { reviewers: user._id } };
    const options = { new: true };
    await Article.findOneAndUpdate(query, toAdd, options);
    new RolesArticle({ id_user: user._id, id_article: req.params.id, right: 'reviewer' }).save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports.addAssociateEditor = async function (req, res, next) {
  try {
    if (req.body.associate_editors === undefined)
      throw { success: false, message: 'Missing parameters in body field.' };
    const user = await User.findOne({ email: req.body.associate_editors.email }).exec();
    new RolesArticle({ id_user: user._id, id_article: req.params.id, right: 'associate_editor' }).save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports.createVersion = async function (req, res, next) {
  try {
    if (req.body.name === undefined || req.body.title === undefined ||
      req.body.abstract === undefined || req.body.arr_content === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const newVersion = {
      name: req.body.name,
      title: req.body.title,
      abstract: req.body.abstract,
      arr_content: req.body.arr_content,
      date: new Date()
    };
    const query = {
      _id: req.params.id
    };
    const toPush = {
      $push : { version: newVersion }
    };
    const options = {
      new: true
    };
    await Article.findOneAndUpdate(query, toPush, options).exec();
    res.status(201).json({success: true});
  } catch (e) {
    next(e);
  }
};
