'use strict';

const User = require('../user/user.model')
const Article = require('../article/article.model')
const Journal = require('./journal.model')

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
    let journals;
    if (req.params.id === undefined) {
      journals = await Journal.paginate({ deleted: false, published: true }, {
        page,
        limit,
        populate: 'editor',
        lean: true
      });
      console.log(JSON.stringify(journals, null, "\t"))
      renameObjectProperty(journals, 'docs', 'journals');
    } else {
      console.log(JSON.stringify("findJournalById", null, "\t"))
      journals = await Journal.findById(req.params.id).populate('article').lean();
      console.log(JSON.stringify(journals, null, "\t"))
      if (!journals) return res.sendStatus(404);
    }
    return res.status(200).json(journals);
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

    return res.status(200).json({ success: true, journal: journal });
  } catch (err) {
    return next(err);
  }
};

/**
 * @function deleteJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.deleteJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    await Journal.findOneAndRemove(query);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

/**
 * @function addArticleToJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.addArticleToJournal = async (req, res, next) => {
  try {
    let query = { _id: req.body.id_article };
    const article = await Article.findOne(query);
    if (article === null)
      throw { success: false, message: 'You can\'t add an article which does\'nt exist.' }
    query._id = req.params.id_journal;
    const toUpdate = { $push: { content: article } };
    const options = { new: true };
    await Journal.findOneAndUpdate(query, toUpdate, options);
    res.json({ success: true });
  } catch (e) {
    next(e)
  }
}

/**
 * @function removeArticleFromJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.removeArticleFromJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id_journal };
    const journalInfo = await Journal.findOne(query);
    for (let i = 0, len = journalInfo.content.length; i < len; ++i)
      if (journalInfo.content[i]._id.toString() === req.params.id_article.toString()) {
        console.log("HE FOUND IT")
        delete journalInfo.content[i];
      }
    res.json({ success: true });
  } catch (e) {
    next(e)
  }
}
