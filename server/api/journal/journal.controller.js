'use strict';

const User = require('../user/user.model')
const Article = require('../article/article.model')
const Journal = require('./journal.model')
const Roles = require('../roles/journal/roles.journal.model')
const Invitation = require('../invitations/invitations.model')
const Email = require('../email/email.controller')

const shortid = require('shortid')
const configEmail = require('../../../config.js').email

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
 * getArticles - Returns an array of articles requested with a page offset and limit,
 * so that results are paginated
 *
 * @function getJournals
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getJournals = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    let journals;
    if (req.params.id === undefined) {
      journals = await Journal.paginate({ deleted: false, published: true }, {
        page,
        limit,
        populate: 'users',
        lean: true
      });
      console.log(JSON.stringify(journals, null, "\t"))
      renameObjectProperty(journals, 'docs', 'journals');
    } else {
      //console.log(JSON.stringify("findJournalById", null, "\t"))
      journals = await Journal.findById(req.params.id)
        .populate('users')
        .populate('article')
        .lean();
      console.log(JSON.stringify(journals, null, "\t"))
      if (!journals) return res.sendStatus(404);
    }
    return res.status(200).json(journals);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function findJournalByIdAndUpdate
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findJournalByIdAndUpdate = async (req, res, next) => {
  try {
    /*req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/
    console.log(JSON.stringify("findJournalbyIdAndUpdate", null, "\t"))
    const title = req.body.title.trim();
    const abstract = req.body.abstract;
    const published = req.body.published;
    const journal = await Journal
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { title, abstract, published } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(journal);
  } catch (err) {
    return next(err);
  }
};


/**
 * @function createJournal
 * @memberof module:controllers/journal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createJournal = async (req, res, next) => {
  try {
    //req.check(ArticleValidator.checkArticleData);
    //const validationResult = await req.getValidationResult();
    /*if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }*/

    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const tags = req.body.tags;
    const published = req.body.published;
    //console.log(published);

    const newJournal = new Journal({ title, abstract, tags, published});
    console.log(JSON.stringify(req.decoded._id, null, "\t"));
    //Add Author to the Journal
    const user = await User.findById( req.decoded._id ).exec();
    // console.log(JSON.stringify(author, null, "\t"));
    newJournal.users[0] = req.decoded._id;
    const journal = await newJournal.save();
    new Roles({ id_user: req.decoded._id, id_journal: journal._id, right: 'editor' }).save();

    console.log(JSON.stringify(journal._id, null, "\t"));

    return res.status(200).json({ success: true, journal: journal });
  } catch (err) {
    return next(err);
  }
};

/**
 * @function deleteJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.deleteJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    await Journal.findOneAndRemove(query);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

/**
 * @function addArticleToJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.addArticleToJournal = async (req, res, next) => {
  try {
    let query = { _id: req.body.id_article };
    const article = await Article.findOne(query);
    if (article === null)
      throw { success: false, message: 'You can\'t add an article which does\'nt exist.' }
    query._id = req.params.id;
    const toUpdate = { $push: { content: { reference: article, published: false } } };
    const options = { new: true };
    await Journal.findOneAndUpdate(query, toUpdate, options);
    res.json({ success: true });
  } catch (e) {
    next(e)
  }
}

/**
 * @function removeArticleFromJournal
 * @author Léo Riberon-Piatyszek
 * @memberOf module:controllers/journal
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.removeArticleFromJournal = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    const toPull = { $pull: { content: { reference: { $in: [req.params.id_article] } } } };
    const options = { multi: false };
    await Journal.findOneAndUpdate(query, toPull, options);
    res.json({ success: true });
  } catch (e) {
    next(e)
  }
}

module.exports.getJournalsUser = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (req.params.role !== undefined)
      query.right = req.params.role;
    const users = await Roles.find(query);
    res.json({ success: true, users: users });
  } catch (e) {
    next(e);
  }
}

module.exports.setArticlePublish = async (req, res, next) => {
  try {
    const query = { _id: req.params.id, content: { reference: { $in: [req.params.id_article] } } };
    const toUpdate = { $set: { content: { published: true } } };
    await Roles.findOneAndUpdate(query, toUpdate);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports.inviteUser = async (req, res, next) => {
  try {
    let senderId = req.body.link,
      senderMsg = req.body.msg,
      receiverEmail = req.body.to,
      senderName = req.body.name,
      newLink = shortid.generate();
    //to avoid '-' in the link
    while(newLink.indexOf('-')>=0){
      newLink = shortid.generate();
    }
    let current = new Date().toISOString()
    const newInvitation = new Invitation({
      "created_at": current,
      "updated_at": current,
      "link": newLink,
      "recieptEmail": receiverEmail,
      "senderId": senderId,
      "senderMsg": senderMsg,
      "senderName": senderName
    });
    await newInvitation.save(async (error, result) => {
      if (error) {
        return console.log(error);
      } else {
        //we send the email to invite the new author to access
        const mail = new Email(receiverEmail);
        const clientUrl = `${configEmail.rootHTML}/invite/${senderId}-${newLink}?redirect=${req.params.id}`;
        if (req.params.right === 'user') {
          await mail.sendInvitationJournalUser(senderId, clientUrl)
        } else {
          const userInfo = await User.findOne({ email: req.body.to });
          const role = new Roles({ id_user: userInfo._id, id_journal: req.params.id, right: 'associate_editor' });
          await role.save();
          await mail.sendInvitationJournalAssociateEditor(senderId, clientUrl)
        }
      }
    })
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

module.exports.followJournal = async (req, res, next) => {
  try {
    let instruction, query = { id_journal: req.params.id, id_user: req.decoded._id }
    const roleInfo = await Roles.findOne(query);
    if (roleInfo === null) {
      instruction = { $push: { users: req.decoded._id } }
      await new Roles({ id_user: req.decoded._id, id_journal: req.params.id }).save()
    } else {
      instruction = { $pull: { users: { $in: [req.decoded._id] } } }
      await Roles.findOneAndDelete(query);
    }
    query = { _id: req.params.id };
    await Journal.findOneAndUpdate(query, instruction);
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

module.exports.userFollowedJournals = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ _id: req.decoded._id });
    const query =  { id_user: userInfo._id }
    console.log('userFollowedJournals :: query :: ', query)
    const response = await Roles.find({query}).exec()//.populate('id_journal');
    console.log('userFollowedJournals :: response :: ', response)
    res.json({success: true, journals: response})
  } catch (e){
    console.log(e)
    next(e)
  }
}
