'use strict';

var User = require('../user/user.model');
var Article = require('../article/article.model');
var Journal = require('./journal.model');

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
 * @function getJournals
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getJournals = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    const journals = await Journal.paginate({ deleted: false, published: true }, { page, limit,populate: 'editor',lean: true });
    console.log(JSON.stringify(journals, null, "\t"))
    renameObjectProperty(journals, 'docs', 'journals');

    return res.status(200).json(journals);
  } catch (err) {
    return next(err);
  }
};

/**
 * getArticleBySlug - Returns an article requested by slug
 *
 * @function findJournalBySlug
 * @memberof module:controllers/journals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findJournalById = async (req, res, next) => {
  try {
    console.log(JSON.stringify("findJournalById", null, "\t"))
    const journal = await Journal.findById(req.params.id).populate('article').lean();
    console.log(JSON.stringify(journal, null, "\t"))
    if (!journal) return res.sendStatus(404);

    return res.status(200).json(journal);
  } catch (err) {
    return next(err);
  }
};


/**
 * @function findJournalByIdAndUpdate
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findJournalByIdAndUpdate = async (req, res, next) => {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    console.log(JSON.stringify("findJournalbyIdAndUpdate", null, "\t"))
    const title = req.body.title.trim();
    const abstract = req.body.abstract;
    const published = req.body.published;
    const journal = await Journal
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { title, abstract, published } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(journal);
  } catch (err) {
    return next(err);
  }
};


/**
 * @function createJournal
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createJournal = async (req, res, next) => {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const published = req.body.published;
    //console.log(published);

    const newJournal = new Journal({ title, abstract,published});
    console.log(JSON.stringify(req.body.id_author, null, "\t"));
    //Add Author to the Journal
    const editor = await User.findById( req.body.id_author ).exec();
    // console.log(JSON.stringify(author, null, "\t"));
    newJournal.editor[0] = editor;
    const journal = await newJournal.save();

    console.log(JSON.stringify(journal._id, null, "\t"));

    return res.status(200).json(journal._id);
  } catch (err) {
    return next(err);
  }
};
