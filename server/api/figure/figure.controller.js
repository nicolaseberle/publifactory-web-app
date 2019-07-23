'use strict';

var Figure = require('./figure.model');

const fs = require('fs');
let {PythonShell} = require('python-shell');
const rscript = require('js-call-r');

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
    let figure = await Figure.findOne({ _id: req.params.id });
    if (figure === undefined || figure.length === 0)
      figure = []
    res.json(figure);
  } catch (err) {
    next(err);
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
    if (req.body.data === undefined || req.body.layout === undefined ||
      req.body.option === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const data = req.body.data;
    const layout = req.body.layout;
    const option = req.body.option;
    const newFigure = new Figure({
      data: data,
      layout: layout,
      option: option
    });
    const figure = await newFigure.save();
    res.status(201).json(figure._id);
  } catch (err) {
    next(err);
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
    if (req.body.data === undefined || req.body.layout === undefined ||
      req.body.option === undefined || req.body.script === undefined ||
      req.body.infos === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const data = req.body.data;
    const layout = req.body.layout;
    const option = req.body.option;
    const script = req.body.script;
    const infos = req.body.infos;
    const updatedFigure = await Figure
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { data, layout, option, script, infos } },
        { new: true }
      );

    if (!updatedFigure) return res.sendStatus(404);

    res.json(updatedFigure._id);
  } catch (err) {
    next(err);
  }
};

/**
 * This function is used to redirect the parameters to the right function
 * It depends on the script used (Python / R)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
module.exports.scripts = async (req, res, next) => {
  try {
    if (req.body.content === undefined || (req.params.script === 'python' && req.body.version === undefined))
      throw { code: 422, message: "Missing parameters." };
    req.params.script === 'r' ? rExec(req, res, next) : pythonExec(req, res, next);
  } catch (e) {
    next(e);
  }
}

/**
 * This function is used to execute python code and do the translation in JSON
 * This JSON output is used to communicate with PlotlyJs
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function pythonExec(req, res, next) {
  try {
    const version = `python${req.body.version}`
    const options = {
      mode: 'text',
      pythonPath: `/usr/bin/${version}`,
      pythonOptions: ['-u'],
      scriptPath: (process.env.DOCKER === 'true' ? '/tmp/' : __dirname),
      args: []
    };
    for (let i = 0, len = req.body.content.length; i < len; i++)
      await fs.writeFileSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + req.body.content[i].title,
        req.body.content[i].content);
    await new Promise((resolve, reject) => {
      PythonShell.run('main.py', options, (err) => {
        if (err) reject(err);
        resolve('OK')
      })
    });
    for (let i = 0, len = req.body.content.length; i < len; ++i)
      await fs.unlinkSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + req.body.content[i].title);
    const jsonRawData = fs.readFileSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + 'example.json')
    const json = JSON.parse(jsonRawData);
    await fs.unlinkSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + 'example.json');
    res.json({ success: true, values: json });
  } catch (e) {
    res.status(500).json({ success: false, message: e})
  }
}

/**
 * This function is used to execute R code and do the translation in JSON
 * This JSON output is used to communicate with PlotlyJs
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function rExec(req, res, next) {
  try {
    for (let i = 0, len = req.body.content.length; i < len; i++)
      await fs.writeFileSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + req.body.content[i].title,
        req.body.content[i].content);
    const response = await rscript.callSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + 'main.R');
    const json = JSON.parse(response.x.data)
    for (let i = 0, len = req.body.content.length; i < len; ++i)
      await fs.unlinkSync((process.env.DOCKER === 'true' ? '/tmp/' : './') + req.body.content[i].title);
    res.json({ success: true, values: json });
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: "Your script isn't correct. Please check your syntax." })
  }
}
