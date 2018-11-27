'use strict';

var User = require('../user/user.model');
var Article = require('../article/article.model');
var Data = require('./data.model');

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
 * @function getData
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getData = async (req, res, next) => {


  try {
    console.log("getData")
    const articleId = req.params.id.trim()
    const article = await Article.findById(articleId).populate('arr_data').lean();
    const data = await Data.findById(article.arr_data[0]).lean();
    console.log(JSON.stringify(data, null, "\t"))
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
module.exports.createData = async (req, res, next) => {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    const name = req.body.name;
    // console.log(JSON.stringify(name));
    const header = req.body.header;
    // console.log(JSON.stringify(header));
    const content = req.body.content;
    console.log(JSON.stringify(content, null, "\t"))

    //console.log(content);
    // const published = req.body.published;
    //console.log(published);

    const newData = new Data({ "name": JSON.stringify(name), "header": JSON.stringify(header),"content": JSON.stringify(content)});

    //Add category to the Article
    //Catch the good category

    const article = await Article.findById(req.body.id).populate('arr_data').lean();
    console.log(JSON.stringify(article, null, "\t"));
    const data = await newData.save();
    console.log(JSON.stringify(data._id, null, "\t"));

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
