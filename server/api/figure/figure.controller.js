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
 * @function getData
 * @description This function is used to retrieve the figure information to load
 * the figure (to make edit or print the figure in the article).
 * @memberof module:controllers/data
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
exports.getFigure = async (req, res, next) => {
  try {
    let figure = await Figure.findOne({ _id: req.params.id });
    if (figure === undefined || figure.length === 0)
      figure = [];
    res.json(figure);
  } catch (err) {
    next(err);
  }
};

/**
 * @function createFigure
 * @description This function is used to create the figure in the database.
 * This function take several parameters in the body field :
 *  - data, the source code of the figure
 *  - layout, the title of the figure
 *  - option, the PlotlyJs options
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
 * @description This function is used to update the figure in the database when
 * you modify the source code of the Python / R script.
 * This function take several parameters in the body field :
 *  - data, the source code of the figure
 *  - layout, the title of the figure
 *  - option, the PlotlyJs options
 *  - script, the script type (R or Python)
 *  - infos, the version of the language (only for Python script)
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
 * @function scripts
 * @description This function is used to redirect the parameters to the right function
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
    req.params.script === 'r' ? await rExec(req, res, next) : await pythonExec(req, res, next);
  } catch (e) {
    next(e);
  }
};

/**
 * @function pythonExec
 * @description This function is used to execute python code and do the translation in JSON
 * This JSON output is used to communicate with PlotlyJs
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function pythonExec(req, res, next) {
  try {
    const path = (process.env.DOCKER === 'true' ? '/tmp/' : './');
    const version = `python${req.body.version}`;
    const options = {
      mode: 'text',
      pythonPath: `/usr/bin/${version}`,
      pythonOptions: ['-u'],
      scriptPath: (process.env.DOCKER === 'true' ? '/tmp/' : __dirname),
      args: []
    };
    for (let i = 0, len = req.body.content.length; i < len; i++)
      await fs.writeFileSync(path + req.body.content[i].title,
        req.body.content[i].content);
    await new Promise((resolve, reject) => {
      PythonShell.run('main.py', options, (err) => {
        if (err) reject(err);
        resolve('OK')
      })
    });
    for (let i = 0, len = req.body.content.length; i < len; ++i)
      if (await fs.existsSync(path + req.body.content[i].title))
        await fs.unlinkSync(path + req.body.content[i].title);
    const jsonRawData = fs.readFileSync(path + 'example.json');
    const json = JSON.parse(jsonRawData);
    await fs.unlinkSync(path + 'example.json');
    res.json({ success: true, values: json });
  } catch (e) {
    res.status(500).json({ success: false, message: e})
  }
}

/**
 * @function rExec
 * @description This function is used to execute R code and do the translation in JSON
 * This JSON output is used to communicate with PlotlyJs
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function rExec(req, res, next) {
  try {
    const path = (process.env.DOCKER === 'true' ? '/tmp/' : './');
    for (let i = 0, len = req.body.content.length; i < len; i++)
      await fs.writeFileSync(path + req.body.content[i].title,
        req.body.content[i].content);
    const response = await rscript.callSync(path + 'main.R');
    const json = JSON.parse(response.x.data);
    for (let i = 0, len = req.body.content.length; i < len; ++i)
      if (await fs.existsSync(path + req.body.content[i].title))
        await fs.unlinkSync(path + req.body.content[i].title);
    res.json({ success: true, values: json });
  } catch (e) {
    res.status(500).json({ success: false, message: "Your script isn't correct. Please check your syntax." })
  }
}
