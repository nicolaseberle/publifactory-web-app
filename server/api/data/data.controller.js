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
 * @function getData
 * @description This function is used to get the datas of an article from its id
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<*>}
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
 * @description This function is used to create a new data set.
 * This function take several parameters in the body field:
 *  - name, the name of the data to  set
 *  - header, the headers of the CSV values
 *  - content, the values of the CSV
 *  - id, the targeted article's id
 * @memberof module:controllers/data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<*>}
 */
module.exports.createData = async (req, res, next) => {
  try {
    if (req.body.id === undefined || req.body.name === undefined
      || req.body.header === undefined || req.body.content === undefined)
      throw { code: 422, message: "Missing parameters." };
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

/**
 * @function tryConnection
 * @description This function is used to test if the values in the body field
 * are correct to connect to a database.
 * This function take several parameters in the body field :
 *  - host, the hostname of the database
 *  - port, the port of the database
 *  - type, the database type (PostGreSQL, MySQL, MongoDB)
 *  - database, the name of the database to connect (optional)
 *  - user, the username to login the database (optional)
 *  - password, the password to login the database (optional)
 * @param req
 * @return {Promise<MongoClient|Connection|PG.Pg>}
 * @author Léo Riberon-Piatyszek
 */
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

/**
 * @function tryConnection
 * @description This function is used to query on a database.
 * This function take several parameters in the body field :
 *  - host, the hostname of the database
 *  - port, the port of the database
 *  - type, the database type (PostGreSQL, MySQL, MongoDB)
 *  - query, the query to send to the database
 *  - database, the name of the database to connect (optional)
 *  - user, the username to login the database (optional)
 *  - password, the password to login the database (optional)
 * @param req
 * @return {Promise<MongoClient|Connection|PG.Pg>}
 * @author Léo Riberon-Piatyszek
 */
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

/**
 * @function sqlConnect
 * @description This function is used to try the connection to a database.
 * If the connection doesn't succeed, an error will be thrown with the
 * HTML code 100
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.sqlConnect = async (req, res, next) => {
  try {
    await tryConnection(req);
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
};

/**
 * @function sqlQuery
 * @description This function is uses to query to the database you tried your
 * connections on.
 * This functions will return the response of the query or, in case of failure,
 * will throw the SQL error
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.sqlQuery = async (req, res, next) => {
  try {
    const connection = await tryConnection(req);
    const response = await execQuery(req, connection);
    res.json({ success: true, result: response });
  } catch (e) {
    next(e);
  }
};