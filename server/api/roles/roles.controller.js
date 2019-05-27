'use strict';

/**
 * Models of the Roles table
 * @type {*|*[]|(function(*, *): (null|*))|(function(*, *): *)|(function(*, *=, *=): *)|(function(*=, *, *): boolean)|{preTransformNode}|string}
 */
const Roles = require('./roles.model')

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
    console.log('User : %s, Article : %s, Right : %s', id_user, id_article, right);
    const roles = new Roles({ id_user, id_article, right });
    roles.save();
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

async function doYouHaveThisRight () {

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
  getRoleById: getRoleById
};
