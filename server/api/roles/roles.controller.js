'use strict';

/**
 * Models of the Roles table
 * @type {*|*[]|(function(*, *): (null|*))|(function(*, *): *)|(function(*, *=, *=): *)|(function(*=, *, *): boolean)|{preTransformNode}|string}
 */
const Roles = require('./roles.model')
const Article = require('../article/article.model')
const User = require('../user/user.model')

/**
 * This route permit to get all the users of an article with their rights.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function getArticleUsers (req, res, next) {
  try {
    const query = { id_article: req.body.id_article };
    if (req.params.right)
      query.right = req.params.right;
    const users = await new Promise(async (resolve, reject) => {
      resolve(await Roles.find(query));
    });
    res.json({ success: true, users: users})
  } catch (e) {
    next(e);
  }
}

/**
 * This route permit to get all the roles of an user on every article he is incorporated.
 * TODO : If the id parameter isn't specified, it will return the roles of the connected user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function getUserRoles (req, res, next) {
  try {
    const query = { id_user: (req.params.id ? req.params.id : null) };
    const response = await new Promise(async (resolve, reject) => {
      resolve(await Roles.find(query));
    });
    res.json({ success: true, role: response })
  } catch (e) {
    next(e);
  }
}

/**
 * This route permit to get the role's information by its id.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function getRoleById (req, res, next) {
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

/**
 * This route permit to remove a role definitively
 * TODO : If the deleted user came back, his role will be 'guest'
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function deleteRole (req, res, next) {
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

/**
 * This route permit to modify the rights of a precise role
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function modifyRight (req, res, next) {
  try {
    if (!req.body.right)
      throw { code: 422, message: "Missing parameters in body field." }
    if (!['author', 'associate_editor', 'reviewer', 'guest'].includes(req.body.right))
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

/**
 * This route permit to create a new role
 * To create a new role, it needs in body field :
 *   - id_user -> the user id to set the role
 *   - id_article -> the embedded article of the user
 *   - right -> the right of the user on the article
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function createRole (req, res, next) {
  try {
    if (!(req.body.id_user && req.body.id_article && req.body.right))
      throw { code: 422, message: "Missing parameters in body field." }
    if (!['author', 'associate_editor', 'reviewer', 'guest'].includes(req.body.right))
      throw { code: 404, message: "This right doesn't exist." }
    const id_user = req.body.id_user;
    const id_article = req.body.id_article;
    const right = req.body.right;
    const roles = new Roles({ id_user, id_article, right });
    roles.save();
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

async function switchRoute (route, articleInfo) {
  let status;
  switch (route) {
    case 'comment':
      status = await new Promise((resolve, reject) => {
        const query = { _id: articleInfo.id_article }
        Article.findOne(query, (err, data) => {
          if (err) reject(err)
          else resolve(data.status)
        })
      })
      if (status !== 'published' && articleInfo.right === 'guest')
        throw { message: "Guests can't publish a review / comment." }
      break;
    case 'articleModify':
      if (articleInfo.right !== 'author')
        throw { message: "Only the author can modify the article." }
      break;
    case 'articleRead':
      status = await new Promise((resolve, reject) => {
        const query = { _id: articleInfo.id_article }
        Article.findOne(query, (err, data) => {
          if (err) reject(err)
          else resolve(data.status)
        })
      })
      if ((status === 'Reviewing' || status === 'Submited') && articleInfo.right === 'guest')
        throw { message: "A guest can't access to a submitted / reviewing article." }
      else if (status === 'Draft' && articleInfo.right !== 'author')
        throw { message: "Only the author can access a drafted article." }
      break;
    case 'submit':
      if (articleInfo.right !== 'author')
        throw { message: 'Only the authors can submit an artcle.' };
      break;
    case 'review':
    case 'publish':
      if (articleInfo.right !== 'associate_editor')
        throw { message: 'Only the associate editor is able to set status in review / publish.' };
      break;
    case 'inviteReviewer':
      const infoAuthor = await new Promise((resolve, reject) => {
        const query = { _id: articleInfo.id_user }
        User.findOne(query, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
      if (infoAuthor.role !== 'editor')
        throw { message: 'Only the editor and associate_editor are able to invite reviewers.' };
      break;
    case 'inviteCollaborator':
      if (articleInfo.right !== 'author')
        throw { message: 'Only the lead author is able to invite other collaborator' };
      const authors = await new Promise((resolve, reject) => {
        const query = { _id: articleInfo.id_article }
        Article.findOne(query, (err, data) => {
          if (err) reject(err)
          else resolve(data.authors)
        })
      })
      for (let i = 0, len = authors.length; i < len; ++i)
        if (authors[i].author._id.toString() === articleInfo.id_user.toString() && authors[i].role === 'Lead')
          return;
      throw { message: 'Only the lead author is able to invite other collaborator' };
  }
}

async function doYouHaveThisRight (req, res, next) {
  try {
    const articleInfo = await new Promise((resolve, reject) => {
      const query = { id_user: req.decoded._id, id_article: req.params.id }
      Roles.findOne(query, function(err, data) {
        if (err) reject(err);
        else if (data === null) resolve({ id_user: req.decoded._id, id_article: req.params.id })
        else resolve(data);
      })
    });
    await switchRoute(req.route, articleInfo);
    next();
  } catch (e) {
    console.error(e);
    // Throw to catch the error and transmit it to the router.use route.
    // The router.use will res.status(e.code).json({ success: false, message: "THE ERROR MESSAGE" });
    throw e;
  }
}

/**
 * All functions with their declarations and their implementation in this file.
 * @type {{getRoleById: getRoleById, createRole: createRole, modifyRight: modifyRight, getUserRoles: getUserRoles, deleteRole: deleteRole, getArticleUsers: getArticleUsers}}
 */
module.exports = {
  deleteRole: deleteRole,
  createRole: createRole,
  modifyRight: modifyRight,
  getArticleUsers: getArticleUsers,
  getUserRoles: getUserRoles,
  getRoleById: getRoleById,
  doYouHaveThisRight: doYouHaveThisRight
};
