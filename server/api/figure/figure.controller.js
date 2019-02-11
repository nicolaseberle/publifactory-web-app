'use strict';

var User = require('../user/user.model');
var Article = require('../article/article.model');
var Data = require('../data/data.model');
var Figure = require('./figure.model');

var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
var _ = require('lodash')
var mongoose = require('mongoose');

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
 * @function getData
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getFigure = async (req, res, next) => {


  try {
    let data = [];
    console.log("getFigure");
    const articleId = req.params.id.trim()
    const article = await Article.findById(articleId).populate('arr_data').lean();
    if (article.arr_data === undefined || article.arr_data.length == 0) {
      data = []  // array empty or does not exist
    }else{
      data = await Data.find({'_id': { $in: article.arr_data}}).lean();
    }

    return res.status(200).json(data);
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
module.exports.createFigure = async (req, res, next) => {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    const data = req.body.data;
    const layout = req.body.layout;
    const option = req.body.option;

    const newFigure = new Figure({ "data": JSON.stringify(data), "layout": JSON.stringify(layout),"option": JSON.stringify(option)});

    const article = await Article.findById(req.body.id).populate('arr_data').lean();
    console.log(JSON.stringify(article, null, "\t"));
    const figure = await newFigure.save();
    console.log(JSON.stringify(figure._id, null, "\t"));

    // article.arr_data.push(data);
    // article.save();
    Article.findByIdAndUpdate(req.body.id, {
      $push: { arr_data:  data._id}
    }, { 'new': false}).exec()
    // console.log(JSON.stringify(article._id, null, "\t"));

    return res.status(200).json(data._id);
  } catch (err) {
    return next(err);
  }
};
