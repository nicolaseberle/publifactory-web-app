'use strict';

var User = require('../user/user.model');
var Article = require('../article/article.model');
var Data = require('../data/data.model');
var Figure = require('./figure.model');

const fs = require('fs');
let {PythonShell} = require('python-shell');
const rscript = require('js-call-r');

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
    let figure = await Figure.findById(figureId).lean();
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
    const newFigure = new Figure({
      data: data,
      layout: layout,
      option: option
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
    const script = req.body.script;
    console.log("updateFigure");
    const updatedFigure = await Figure
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { data, layout, option, script } },
        { new: true }
      );

    if (!updatedFigure) return res.sendStatus(404);

    console.log(JSON.stringify(updatedFigure._id, null, "\t"));

    return res.status(200).json(updatedFigure._id);
  } catch (err) {
    return next(err);
  }
};

module.exports.scripts = async (req, res, next) => {
  try {
    if (req.body.content === undefined || (req.params.script === 'python' && req.body.version === undefined))
      throw { code: 422, message: "Missing parameters in body field." };
    req.params.script === 'r' ? rExec(req, res, next) : pythonExec(req, res, next);
  } catch (e) {
    next(e);
  }
}

async function pythonExec(req, res, next) {
  try {
    const version = `python${req.body.version}`
    const options = {
      mode: 'text',
      pythonPath: `/usr/bin/${version}`,
      pythonOptions: ['-u'],
      scriptPath: './',
      args: []
    };
    for (let i = 0, len = req.body.content.length; i < len; i++)
      await fs.writeFileSync(`./${req.body.content[i].title}`, req.body.content[i].content);
    await new Promise((resolve, reject) => {
      PythonShell.run('./main.py', options, (err) => {
        if (err) reject(err);
        resolve('OK')
      })
    });
    for (let i = 0, len = req.body.content.length; i < len; ++i)
      await fs.unlinkSync(req.body.content[i].title);
    const jsonRawData = fs.readFileSync('./example.json')
    const json = JSON.parse(jsonRawData);
    await fs.unlinkSync('./example.json');
    res.json({ success: true, values: json });
  } catch (e) {
    console.error("====ERROR====")
    console.error(e);
    res.status(500).json({ success: false, message: e})
  }
}

async function rExec(req, res, next) {
  try {
    await fs.writeFileSync('./example.R', req.body.content);
    const response = await rscript.callSync('./example.R');
    const json = JSON.parse(response.x.data)
    await fs.unlinkSync('./example.R');
    res.json({ success: true, values: json });
  } catch (e) {
    res.status(500).json({ success: false, message: "Your script isn't correct. Please check your syntax." })
  }
}
