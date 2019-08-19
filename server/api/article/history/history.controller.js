'use strict';

const History = require('./history.model');

/* HELPERS */
const renameObjectProperty = require('../../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

const ENUM_INSTRUCTION = {
  SECTION_EDIT: 'has modified a text block.',
  ABSTRACT_EDIT: 'has modified the abstract.',
  NEW_ROW: 'added a new row.',
  NEW_TAG: 'added a new tag.',
  NEW_ONE_BLOCK: 'added a new block.',
  NEW_TWO_BLOCK: 'added two blocks.',
  NEW_BLOCK_TEXT: 'added a new text block.',
  NEW_BLOCK_CHART: 'added a new chart block.',
  NEW_BLOCK_PICTURE: 'added a new picture block.',
  NEW_COMMENT: 'added a new comment.',
  NEW_COLLABORATOR: 'added a new collaborator.',
  NEW_DATA: 'imported a new data.',
  NEW_REVIEWER: 'invited a new reviewer.',
  NEW_ASSOCIATE_EDITOR: 'invited a new Associate Editor.',
  NEW_VERSION: 'created a new version',
  REMOVE_BLOCK: 'removed a block.',
  REMOVE_ROW: 'removed a row.',
  REMOVE_DATA: 'removed a data.',
  REMOVE_COLLABORATOR: 'has removed a collaborator.',
  UPDATE_BLOCK_PICTURE: 'has modified a picture block.',
  UPDATE_TITLE: 'has modified the title.',
  UPDATE_COLLABORATOR: 'has modified collaborators rights.',
  UPDATE_STATUS: 'has modified the article status.',
  UPDATE_VERSION: 'has modified the file version.',
  EXEC_CODE_R: 'has executed the R chart\'s code.',
  EXEC_CODE_PYTHON: 'has executed the Python chart\'s code.',
  EXEC_PDF: 'has downloaded the article as a PDF.'
};

function addInstruction (User, instruction) {
  if (!Object.keys(ENUM_INSTRUCTION).includes(instruction))
    return;
  const pattern = {
    id_user: User.idUser,
    id_article: User.idArticle,
    date: new Date(),
    instruction: instruction
  };
  if (instruction === 'UPDATE_STATUS' || instruction === 'NEW_COLLABORATOR' || instruction === 'NEW_REVIEWER'
    ||instruction === 'NEW_ASSOCIATE_EDITOR')
    pattern.priority = 1;
  const query = {
    id_user: pattern.id_user,
    id_article: pattern.id_article,
    instruction: pattern.instruction
  };
  History.find(query)
    .sort({ date: -1 })
    .limit(1)
    .exec((err, history) => {
      if (err) throw err;
      if (!history.length || (history.length && history[0].date < Date.now() - 300000))
        new History(pattern).save();
    })
}

async function getHistory(req, res, next) {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  try {
    const query = {
      id_article: req.params.id_article
    };
    if (req.params.id_user)
      query.id_user = req.params.id_user;
    const response = await History.paginate(query, { page, limit,populate: 'id_user',lean: true });
    renameObjectProperty(response, 'docs', 'history');
    // const response = await History.find(query).sort({ date: -1 }).exec();
    for (let i = 0, len = response.history.length; i < len; ++i)
      response.history[i].instruction = ENUM_INSTRUCTION[response.history[i].instruction];
    res.json({success: true, history: response.history});
  } catch (e) {
    next(e)
  }
}

async function insertInstruction (req, res, next) {
  try {
    if (req.body.instruction === undefined)
      throw { code: 422, message: "Missing parameters." };
    const userClass = {
      idUser: req.decoded._id,
      idArticle: req.params.id
    };
    addInstruction(userClass, req.body.instruction);
    res.status(201).json({ success: true })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  addInstruction: addInstruction,
  insertInstruction: insertInstruction,
  getHistory: getHistory
};
