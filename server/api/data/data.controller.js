'use strict';

var Article = require('../article/article.model');
var Data = require('./data.model');

const mysql = require('mysql');
const { Pg } = require('pg');
const mongodb = require('mongodb').MongoClient;

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

async function tryConnection(req) {
  try {
    if (!req.body.host || !req.body.port)
      throw {code: 422, message: 'Missing parameters.'};
    const config = {
      host: req.body.host,
      database: req.body.database,
      user: req.body.user,
      password: req.body.password,
      port: req.body.port
    };
    let client;
    if (req.body.type === "mysql") {
      client = mysql.createConnection(config);
      await new Promise((resolve, reject) => {
        client.connect(function (err) {
          if (err) reject(err);
          resolve();
        });
      });
    } else if (req.body.type === "pg") {
      client = new Pg(config);
      await client.connect();
    } else {
      let connectionString = 'mongodb://';
      if (req.body.user && req.body.password)
        connectionString = connectionString + `${req.body.user}:${req.body.password}@`;
      connectionString = connectionString + `${req.body.host}:${req.body.port}`;
      if (req.body.database)
        connectionString = connectionString + `/${req.body.database}`;
      client = new mongodb(connectionString);
      await client.connect((err) => {
        if (err) throw err;
        client.close();
      });
    }
    return client;
  } catch (e) {
    throw { code: 100, message: "Connection refused." };
  }
}

async function execQuery (req, connection) {
  try {
    if (!req.body.query)
      throw { code: 422, message: "Missing query parameter." };
    return await new Promise((resolve, reject) => {
      if (req.body.type === "mysql" || req.body.type === "pg") {
        connection.query(req.body.query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
      } else {
        req.body.query = JSON.parse(req.body.query);
        if (req.body.query.collection === undefined || req.body.query.query === undefined)
          reject({ code: 422, message: 'Missing parameters in the query field.' });
        connection.connect((err) => {
          if (err) reject(err);
          const db = req.body.database ? connection.db(req.body.database) : connection.db();
          if (db !== null)
            db.collection(req.body.query.collection).find(req.body.query.query).toArray((err, result) => {
              if (err) throw err;
              connection.close();
              resolve(result);
            });
        })
      }
    });
  } catch (e) {
    throw e;
  }
}

module.exports.sqlConnect = async (req, res, next) => {
  try {
    await tryConnection(req);
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
};

module.exports.sqlQuery = async (req, res, next) => {
  try {
    const connection = await tryConnection(req);
    const response = await execQuery(req, connection);
    res.json({ success: true, result: response });
  } catch (e) {
    next(e);
  }
};