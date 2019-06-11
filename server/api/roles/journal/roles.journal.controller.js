'use strict';

const RolesJournal = require('./roles.journal.model')
const RolesArticle = require('../article/roles.article.model')

module.exports.createRole = function (req, res, next) {
  try {
    if (!(req.body.id_user && req.body.id_journal && req.body.right))
      throw { code: 422, message: "Missing parameters in body field." }
    if (!['editor', 'associate_editor', 'user'].includes(req.body.right))
      throw { code: 404, message: "This right doesn't exist." }
    const id_user = req.body.id_user;
    const id_journal = req.body.id_journal;
    const right = req.body.right;
    const roles = new RolesJournal({ id_user, id_journal, right });
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
    await RolesJournal.updateOne(query, newValues, (err, result) => {
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
    await RolesJournal.deleteOne(query, (err, result) => {
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
      resolve(await RolesJournal.find(query))
    });
    res.json({ success: true, role: response })
  } catch (e) {
    next(e);
  }
}
module.exports.getUserRoles = async function (req, res, next) {
  try {
    const query = { id_user: (req.params.id ? req.params.id : req.decoded._id) };
    const response = await RolesJournal.find(query);
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
    const users = await RolesJournal.find(query).populate('id_user');
    res.json({ success: true, users: users})
  } catch (e) {
    next(e);
  }
}

module.exports.invite = async function (req, res, next) {
  try {
    if (req.params.right !== 'user') {
      req.route = 'invite'
      await doYouHaveThisRight(req, res, next);
    } else
      next()
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
}

module.exports.publish = async function (req, res, next) {
  try {
    req.route = 'publish'
    await doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
}

module.exports.owner = async function (req, res, next) {
  try {
    req.route = 'owner'
    req.params.id_article = req.params.id_article || req.body.id_article
    await doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
}

module.exports.administration = async function (req, res, next) {
  try {
    req.route = 'admin'
    await doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
}

async function switchRoute (req, journalInfo) {
  switch (req.route) {
    case 'owner':
      const query = { id_user: journalInfo.id_user, id_article: req.params.id_article }
      const articleInfo = await RolesArticle.findOne(query);
      if (!articleInfo || articleInfo.right !== 'author')
        throw { message: 'Only the author can post his article in a journal.' }
      break;
    case 'invite':
    case 'admin':
      if (journalInfo.right !== 'editor')
        throw { message: 'Only the editor (admin) can access to thoses settings.' }
      break;
    case 'publish':
      if (journalInfo.right !== 'editor' && journalInfo.right !== 'associate_editor')
        throw { message: 'Only the editor and the associate_editor can decide to publish the article ' +
            'on the journal' };
      break;
  }
}

async function doYouHaveThisRight (req, res, next) {
  try {
    const journalInfo = await new Promise((resolve, reject) => {
      const query = { id_user: req.decoded._id, id_journal: req.params.id }
      RolesJournal.findOne(query, function(err, data) {
        if (err) reject(err)
        else if (data === null) resolve({id_user: req.decoded._id, id_journal: req.params.id, right: 'user'})
        else resolve(data);
      })
    });
    await switchRoute(req, journalInfo);
    next();
  } catch (e) {
    console.error(e);
    // Throw to catch the error and transmit it to the router.use route.
    // The router.use will res.status(e.code).json({ success: false, message: "THE ERROR MESSAGE" });
    throw e;
  }
}
