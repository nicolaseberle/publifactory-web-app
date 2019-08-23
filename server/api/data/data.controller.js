'use strict';

var Article = require('../article/article.model');
var Data = require('./data.model');

const mysql = require('mysql');
const { Pg } = require('pg');
const mongodb = require('mongoose');

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

module.exports.sqlConnect = async (req, res, next) => {
  try {
    if (req.body.type === "mysql") {
      const config = {
        connectionLimit: 50,
        host: req.body.host,
        database: req.body.database,
        user: req.body.user,
        password: req.body.password,
        port: req.body.port,
        debug: false
      };
      const connection = mysql.createConnection(config);
      connection.connect(function (err) {
        if (err) throw err;
      });
    } else if (req.body.type === "pg") {
      const config = {
        host: req.body.host,
        database: req.body.database,
        user: req.body.user,
        password: req.body.password,
        port: req.body.port
      };
      const client = new Pg(config);
      await client.connect();
    } else {
      let connectionString = 'mongodb://';
      if (req.body.user && req.body.password)
        connectionString = connectionString + `${req.body.user}:${req.body.password}@`;
      connectionString = connectionString + `${req.body.host}:${res.body.port}`;
      if (req.body.database)
        connectionString = connectionString + `/${req.body.database}`;
      await mongodb.connect(connectionString);
    }
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
};

module.exports.sqlQuery = async (req, res, next) => {
  try {

  } catch (e) {
    next(e);
  }
};