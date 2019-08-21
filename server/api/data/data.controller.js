'use strict';

var Article = require('../article/article.model');
var Data = require('./data.model');

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
 * @function getData
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getData = async (req, res, next) => {
  try {
    const data = await Data.find({id_article: req.params.id}).exec();
    res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function createData
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createData = async (req, res, next) => {
  try {
    const newData = new Data({
      name: req.body.name,
      header: req.body.header,
      content: req.body.content,
      id_article: req.body.id,
      id_user: req.decoded._id
    });
    const data = await newData.save();

    // article.arr_data.push(data);
    // article.save();
    Article.findByIdAndUpdate(req.body.id, {
      $push: { arr_data:  data._id}
    }, { 'new': false}).exec()
    res.status(200).json(data._id);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
