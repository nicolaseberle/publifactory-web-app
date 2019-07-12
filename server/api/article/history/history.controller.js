'use strict';

const History = require('./history.model');

function addInstruction (User, instruction) {
  const pattern = {
    id_user: User.idUser,
    id_article: User.idArticle,
    date: new Date(),
    instruction: instruction
  };
  const query = pattern;
  query.date = patter.date - ;
  History.find()
  new History(pattern).save();
}

modules.export = {
  addInstruction: addInstruction
};
