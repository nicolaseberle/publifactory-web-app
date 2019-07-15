'use strict';

const History = require('./history.model');

function addInstruction (User, instruction) {
  const pattern = {
    id_user: User.idUser,
    id_article: User.idArticle,
    date: new Date(),
    instruction: instruction
  };
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
  try {
    const query = {
      id_article: req.params.id_article
    };
    if (req.params.id_user)
      query.id_user = req.params.id_user;
    const response = await History.find(query).exec();
    res.json({success: true, history: response});
  } catch (e) {
    next(e)
  }
}

module.exports = {
  addInstruction: addInstruction,
  getHistory: getHistory
};
