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
    const figureId = req.params.id.trim()
    const figure = await Figure.findById(figureId).lean();
    if (figure === undefined) {
      figure = []
    }
    return res.status(200).json(figure);
  } catch (err) {

    return next(err);
  }
};

/**
 * @function createFigure
 * @memberof module:controllers/figure
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createFigure = async (req, res, next) => {
  try {
    const data = req.body.data;
    const layout = req.body.layout;
    const option = req.body.option;
    console.log("createFigure");
    const newFigure = new Figure({ "data": JSON.stringify(data),
                                  "layout": JSON.stringify(layout),
                                  "option": JSON.stringify(option)
                                });

    //const article = await Article.findById(req.body.id).populate('arr_data').lean();
    //console.log(JSON.stringify(article, null, "\t"));
    const figure = await newFigure.save();
    console.log(JSON.stringify(figure._id, null, "\t"));

    return res.status(200).json(figure._id);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function upDateFigure
 * @memberof module:controllers/figure
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.updateFigure = async (req, res, next) => {
  try {
    const data = req.body.data;
    const layout = req.body.layout;
    const option = req.body.option;
    console.log("updateFigure");
    const updatedFigure = await Figure
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { data, layout, option} },
        { new: true }
      );

    if (!updatedFigure) return res.sendStatus(404);

    console.log(JSON.stringify(updatedFigure._id, null, "\t"));

    return res.status(200).json(updatedFigure._id);
  } catch (err) {
    return next(err);
  }
};
