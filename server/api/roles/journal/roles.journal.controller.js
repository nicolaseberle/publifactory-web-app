'use strict';

const Roles = require('./roles.journal.model')

module.exports.createRole = function (req, res, next) {
  try {
    if (!(req.body.id_user && req.body.id_journal && req.body.right))
      throw { code: 422, message: "Missing parameters in body field." }
    if (!['editor', 'associate_editor', 'user'].includes(req.body.right))
      throw { code: 404, message: "This right doesn't exist." }
    const id_user = req.body.id_user;
    const id_journal = req.body.id_journal;
    const right = req.body.right;
    const roles = new Roles({ id_user, id_journal, right });
    roles.save();
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}
module.exports.modifyRight = async function (req, res, next) {
  try {
    if (!req.body.right)
      throw { code: 422, message: "Missing parameters in body field." }
    if (!['editor', 'associate_editor', 'user'].includes(req.body.right))
      throw { code: 404, message: "This right doesn't exist." }
    const query = { _id: req.params.id };
    const newValues = { $set: { right: req.body.right } };
    await Roles.updateOne(query, newValues, (err, result) => {
      if (err) throw err
      else console.log(`Document updated ; Result -> ${result}`)
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}
module.exports.deleteRole = async function (req, res, next) {
  try {
    const query = { _id: req.params.id };
    await Roles.deleteOne(query, (err, result) => {
      if (err) throw err
      else console.log(`Document deleted ; Result -> ${result}`)
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}
module.exports.getRoleById = async function (req, res, next) {
  try {
    const query = { _id: req.params.id };
    const response = await new Promise(async (resolve, reject) => {
      resolve(await Roles.find(query))
    });
    res.json({ success: true, role: response })
  } catch (e) {
    next(e);
  }
}
module.exports.getUserRoles = async function (req, res, next) {
  try {
    const query = { id_user: (req.params.id ? req.params.id : req.decoded._id) };
    const response = await Roles.find(query);
    res.json({ success: true, role: response })
  } catch (e) {
    next(e);
  }
}

module.exports.getJournalUsers = async function (req, res, next) {
  try {
    const query = { id_article: req.body.id_journal };
    if (req.params.right)
      query.right = req.params.right;
    const users = await Roles.find(query);
    res.json({ success: true, users: users})
  } catch (e) {
    next(e);
  }
}
