'use strict'

const UserModel = require('../user/user.model')
const UserController = require('../user/user.controller')
const Article = require('../article/article.model')
const Journal = require('./journal.model')
const RolesJournal = require('../roles/journal/roles.journal.model')
const RolesArticle = require('../roles/article/roles.article.model')
const Invitation = require('../invitations/invitations.model')
const Email = require('../email/email.controller')

const shortid = require('shortid')
const configEmail = require('../../../config.js').email

/**
 * Get list of articles
 * restriction: 'admin'
 */

// const Category = require('../category/category.model');

// const ArticleValidator = require('./article.validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty')

const DEFAULT_PAGE_OFFSET = 1
const DEFAULT_LIMIT = 10

/**
 * @function getJournals
 * @description This function is used to get the journal's information.
 * This route can take an id of a journal as url parameter and it will return
 * the information about a specific journal.
 * If none parameter are specified, it will return every journals of the database.
 * @memberof module:controllers/articles
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */
exports.getJournals = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT

  try {
    let journals
    if (req.params.id === undefined) {
      journals = await Journal.paginate({ deleted: false, published: true }, {
        page,
        limit,
        populate: 'users content.reference',
        lean: true
      })
      console.log(JSON.stringify(journals, null, '\t'))
      renameObjectProperty(journals, 'docs', 'journals')
    } else {
      // console.log(JSON.stringify("findJournalById", null, "\t"))
      journals = await Journal.findById(req.params.id)
        .populate('users')
        .populate('content.reference')
        .lean()
      console.log(JSON.stringify(journals, null, '\t'))
      if (!journals) { throw { code: 404, message: 'Journals not found.' } }
    }
    console.log(journals)
    return res.status(200).json(journals)
  } catch (err) {
    return next(err)
  }
}

/**
 * @function findJournalByIdAndUpdate
 * @description This function is used to update the information about a journal
 * This function take several parameters in the body field :
 *  - title, the new title of the journal
 *  - abstract, the new description of the journal
 *  - published, the new boolean to make this journal public or private
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findJournalByIdAndUpdate = async (req, res, next) => {
  try {
    if (
      req.body.title === undefined ||
			req.body.abstract === undefined ||
			req.body.published === undefined
    ) { throw { code: 422, message: 'Missing parameters.' } }
    const title = req.body.title
    const abstract = req.body.abstract
    const published = req.body.published
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { title, abstract, published }},
      { new: true }
    )
    if (!journal) throw { code: 404, message: 'Journal not found.' }
    return res.json(journal)
  } catch (err) {
    return next(err)
  }
}

/**
 * @function createJournal
 * @description This function is used to create a new journal.
 * This function takes several parameters in the body field :
 *  - title, the title to set on the journal
 *  - abstract, a short description of the journal
 *  - published, a boolean to set the journal on public or private mode
 *  - tags, a list of tags which match with the journal
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createJournal = async (req, res, next) => {
  try {
    // req.check(ArticleValidator.checkArticleData);
    // const validationResult = await req.getValidationResult();
    /* if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    if (
      req.body.title === undefined ||
			req.body.abstract === undefined ||
			req.body.published === undefined ||
			req.body.tags === undefined
    ) { throw { code: 422, message: 'Missing parameters.' } }
    const title = req.body.title.trim()
    const abstract = req.body.abstract.trim()
    const tags = req.body.tags
    const published = req.body.published
    const newJournal = new Journal({ title, abstract, tags, published })
    newJournal.users[0] = req.decoded._id
    const journal = await newJournal.save()
    new RolesJournal({ id_user: req.decoded._id, id_journal: journal._id, right: 'editor' }).save()
    res.status(201).json({ success: true, journal: journal })
  } catch (err) {
    next(err)
  }
}

/**
 * @function deleteJournal
 * @description This function is used to delete the targeted journal.
 * This function just need an id the url parameters
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.deleteJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id }
    await Journal.findOneAndRemove(query)
    await RolesJournal.deleteMany({ id_journal: req.params.id })
    res.status(204).json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function addArticleToJournal
 * @description This function is used to add an article into a journal
 * This function take only the article's id in the body field.
 * The new article won't be published until the editor-in-chief allow to set it
 * in public mode.
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.addArticleToJournal = async (req, res, next) => {
  try {
    if (req.body.id_article === undefined) throw { code: 422, message: 'Missing parameters.' }
    let query = { id_journal: req.params.id, right: 'editor' }
    const journalInfo = await RolesJournal.find(query)
    if (journalInfo.length === 0) throw { code: 404, message: 'Journals not found.' }
    for (let i = 0, len = journalInfo.length; i < len; ++i) {
      new RolesArticle({
        id_user: journalInfo[i].id_user,
        id_article: req.body.id_article,
        right: 'editor'
      }).save()
    }
    query = { _id: req.params.id }
    const toAdd = { $push: { content: { published: false, reference: req.body.id_article }}}
    const options = { new: true }
    await Journal.findOneAndUpdate(query, toAdd, options).exec()
    await Article.findOneAndUpdate(
      { _id: req.body.id_article },
      { $set: { journal: req.params.id }}
    ).exec()
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function removeArticleFromJournal
 * @description This function is used to remove an article from a specific journal
 * This function takes two parameters in the url :
 *  - id, which is the targeted journal's id
 *  - id_article, which is the target article's id to remove from the journal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.removeArticleFromJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id }
    const toPull = { $pull: { content: { reference: { $in: [req.params.id_article] }}}}
    const options = { multi: false }
    await Journal.findOneAndUpdate(query, toPull, options)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function getJournalsUser
 * @description This function is used to see every user which has a link with
 * this journal.
 * This function can take two parameters in the url field :
 *  - id, which is the targeted journal's id
 *  - role, which is a filter to match a precise user's role (optionnal)
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.getJournalsUser = async (req, res, next) => {
  try {
    const query = { _id: req.params.id }
    if (req.params.role !== undefined) query.right = req.params.role
    const users = await RolesJournal.find(query).exec()
    res.json({ success: true, users: users })
  } catch (e) {
    next(e)
  }
}

/**
 * @function setArticlePublish
 * @description This function is used to set an article of a journal on public mode.
 * This function takes two parameters in the url field :
 *  - id, which is the targeted journal's id
 *  - id_article, which is the targeted article's id
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.setArticlePublish = async (req, res, next) => {
  try {
    const query = { _id: req.params.id, content: { reference: { $in: [req.params.id_article] }}}
    const toUpdate = { $set: { content: { published: true }}}
    await RolesJournal.findOneAndUpdate(query, toUpdate)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function inviteUser
 * @description This function is used to invite new users to follow the targeted journal
 * This function takes several parameters in the body field:
 *  - link, the link to send to the user
 *  - msg, the message to send with the link
 *  - to, the receiver's mail address
 *  - name, the name of the receiver
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.inviteUser = async (req, res, next) => {
  try {
    if (
      req.body.link === undefined ||
			req.body.msg === undefined ||
			req.body.to === undefined ||
			req.body.name === undefined
    ) { throw { code: 422, message: 'Missing parameters.' } }
    const senderId = req.body.link
    const senderMsg = req.body.msg
    const receiverEmail = req.body.to
    const senderName = req.body.name
    let newLink = shortid.generate()
    // to avoid '-' in the link
    while (newLink.indexOf('-') >= 0) {
      newLink = shortid.generate()
    }
    const current = new Date().toISOString()
    const newInvitation = new Invitation({
      created_at: current,
      updated_at: current,
      link: newLink,
      recieptEmail: receiverEmail,
      senderId: senderId,
      senderMsg: senderMsg,
      senderName: senderName
    })
    await newInvitation.save(async (error, result) => {
      if (error) {
        return console.log(error)
      } else {
        // we send the email to invite the new author to access
        const mail = new Email(receiverEmail)
        const clientUrl = `${configEmail.rootHTML}/invite/${senderId}-${newLink}?redirect=${
          req.params.id
        }`
        if (req.params.right === 'user') {
          await mail.sendInvitationJournalUser(senderId, clientUrl)
        } else {
          let userInfo = await UserModel.findOne({ email: req.body.to })
          if (!userInfo) {
            req.body.email = receiverEmail
            req.body.password = shortid
            req.body.firstname = 'None'
            req.body.lastname = 'None'
            userInfo = await UserController.createGuest(req, res, next)
          }
          const role = new RolesJournal({
            id_user: userInfo._id,
            id_journal: req.params.id,
            right: 'associate_editor'
          })
          await role.save()
          await mail.sendInvitationJournalAssociateEditor(senderId, clientUrl)
        }
      }
    })
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function followJournal
 * @description This function is used to follow or unfollow a journal.
 * This function only takes the targeted journal's id in the url parameters.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.followJournal = async (req, res, next) => {
  try {
    let instruction
    let query = { id_journal: req.params.id, id_user: req.decoded._id }
    const roleInfo = await RolesJournal.findOne(query).exec()
    if (roleInfo === null) {
      instruction = { $push: { users: req.decoded._id }}
      await new RolesJournal({ id_user: req.decoded._id, id_journal: req.params.id }).save()
    } else {
      instruction = { $pull: { users: { $in: [req.decoded._id] }}}
      await RolesJournal.findOneAndDelete(query)
    }
    query = { _id: req.params.id }
    await Journal.findOneAndUpdate(query, instruction)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function addAssociateEditor
 * @description This function is used to add new associate_editor on the targeted
 * journal's id
 * This function only takes the associate_editor parameters in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.addAssociateEditor = async (req, res, next) => {
  try {
    if (req.body.associate_editor === undefined) { throw { code: 422, message: 'Missing parameters.' } }
    const user = await UserModel.findOne({ email: req.body.associate_editor.email }).exec()
    const query = { _id: req.params.id }
    const toAdd = { $push: { users: user._id }}
    const options = { new: true }
    await Journal.findOneAndUpdate(query, toAdd, options)
    console.log('add asssssoooooooooooo editor', req.params.id)
    const newAE = await new RolesJournal({
      id_user: user._id,
      id_journal: req.params.id,
      right: 'associate_editor'
    }).save()
    res.json({ success: true, user: newAE })
  } catch (e) {
    next(e)
  }
}

/**
 * @function removeAssociateEditor
 * @description This function is used to remove an associate_editor from a journal
 * byt its id.
 * * This function only takes the associate_editor_id parameters in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.removeAssociateEditor = async (req, res, next) => {
  try {
    if (req.body.associate_editor_id === undefined) { throw { code: 422, message: 'Missing parameters.' } }
    const user = await UserModel.findOne({ _id: req.body.associate_editor_id }).exec()
    let query = { _id: req.params.id }
    // we keep the user in journal.user matrix
    const toRemove = { $pull: { users: user._id }}
    await Journal.findOneAndUpdate(query, toRemove)
    query = { id_user: user._id, id_journal: req.params.id }
    await RolesJournal.findOneAndRemove(query)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function updateTags
 * @description This function is used to update the tags set on a journal
 * This function takes a list of tags in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.updateTags = async (req, res, next) => {
  try {
    if (req.body.tags === undefined) throw { code: 422, message: 'Missing parameters.' }
    const query = { _id: req.params.id }
    const toReplace = { $set: { tags: req.body.tags }}
    await Journal.findOneAndUpdate(query, toReplace)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 * @function userFollowedJournals
 * @description This function is used to return every journal followed by an user
 * This function takes none parameters, the user's id is set in the decoded JWT.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.userFollowedJournals = async (req, res, next) => {
  try {
    let journals
    const result = await RolesJournal.find({ id_user: req.decoded._id }).populate('id_journal').exec()
    console.log(result)
    /* var arr2 = []
    await result.forEach(async (item)=>{
      var journals =  Journal.findById(item.id_journal)
      console.log(journals)
      await arr2.push(journals)
    })*/
    res.json({ success: true, journals: result })
  } catch (e) {
    console.log('userFollowedJournals :: error :: ', e)
    next(e)
  }
}
