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
    instruction: pattern.instruction,
    data: {
      $gt: pattern.date - 300000
    }
  };
  History.find(query)
    .sort({ date: -1 })
    .limit(1)
    .exec((err, history) => {
      if (err) throw err;
      if (history.length === 0)
        new History(pattern).save();
    })
}

module.exports = {
  addInstruction: addInstruction
};
