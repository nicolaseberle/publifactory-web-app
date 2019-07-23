/**
 * @module controllers/comments
 */

 'use strict';

var User = require('../user/user.model');
var Article = require('../article/article.model');
var Comment = require('./comment.model');

var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
var _ = require('lodash')

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 *
 * @function getArticleComments
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
async function getArticleComments(req, res, next) {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  try {
    const article = await Article.findOne({ _id: req.params.id }).populate('comments').exec();
    if (!article)
      throw { code: 404, message: 'Comments not found.' };
    const comments = await article.comments;
    const childComments = await comments.childComment
    renameObjectProperty(comments, 'docs', 'comments');
    res.json(comments);
  } catch (err) {
    throw err;
  }
}

/**
 *
 * @function getArticleComment
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
async function getArticleComment(req, res, next) {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  try {
    const comments = await Comment.findOne({ uuidComment: req.params.uuid });
    const article = await Article.findOne({ _id: req.params.id });
    if (!article || !comments || !article.comments.includes(comments._id))
      throw { code: 404, message: 'Comments not found.' };
    //const comments = await Comment.paginate({ article }, { page, limit, lean: true });
    res.json(comments);
  } catch (err) {
    throw err;
  }
}

async function getComments (req, res, next) {
  try {
    if (req.params.uuid !== undefined)
      await getArticleComment(req, res, next);
    else
      await getArticleComments(req, res, next);
  } catch (e) {
    next(e)
  }
}

/**
 *
 * @function createArticleComment
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
async function createArticleComment(req, res, next) {
  try {
    /*
    req.check(CommentValidator.checkCommentData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }
    */
    if (req.body.uuidComment === undefined || req.body.anonymousFlag === undefined ||
      req.body.commentFlag === undefined || req.body.reviewRequest === undefined ||
      req.body.content === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const commentFlag = req.body.commentFlag;
    const anonymousFlag = req.body.anonymousFlag;
    const reviewRequest = req.body.reviewRequest;
    const uuidComment = req.body.uuidComment;
    const content = req.body.content.trim();
    const userId = await User.findById( req.decoded._id ).exec();
    const newComment = new Comment({ userId , content, reviewRequest, commentFlag, uuidComment, anonymousFlag })
    const comment = await newComment.save();

    //console.log('newComment : ' + comment);
    // article.comments.push(comment);
    // await article.save();
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment._id } }
    );
    // if it's a review
    if (commentFlag === false) {
      article.nbReviews = article.nbReviews + 1;
      await article.save();

    }// else it's a comment
    else {
      article.nbComments = article.nbComments + 1;
      await article.save();
    }

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @function updateScoreVote
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
async function updateScoreVote(req, res, next) {
  try {
    if (req.body.upvote === undefined || req.body.downvote === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const upvote = req.body.upvote;
    const downvote = req.body.downvote;
    const comment = await Comment.findOneAndUpdate(
      { uuidComment: req.params.uuid },
      { $inc: { 'scores.upvote': upvote,'scores.downvote': downvote} }
    ).exec();
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

/**
 * @function updateComment
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function updateComment(req, res, next) {
  try {
    if (!req.body.content)
      throw { code: 422, message: "Missing parameters." };
    const toFind = { uuidComment: req.params.uuid };
    const toUpdate = { $set: { content: req.body.content } };
    await Comment.findOneAndUpdate(toFind, toUpdate).exec();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @function findCommentAndDelete
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function findCommentAndDelete(req, res, next) {
  try {
    const comment = await Comment.findOneAndRemove({ uuidComment: req.params.uuid });

    const article = await Article.findByIdAndUpdate(
      req.params.id ,
      { $pull: { comments: comment._id } }
    )
    // if it's a review
    if (comment.commentFlag === false) {
      article.nbReviews = article.nbReviews - 1;
      await article.save();

    }// else it's a comment
    else {
      article.nbComments = article.nbComments - 1;
      await article.save();
    }

    if (comment.n === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
}

/**
 * @function answerComment
 *
 * This function is used to answer a comment
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @author Léo Riberon-Piatyszek
 */
async function answerComment(req, res, next) {
  try {
    if (req.body.reviewRequest === undefined || req.body.uuidComment === undefined ||
      req.body.content === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const commentFlag = false;
    const anonymousFlag = req.body.anonymousFlag ? req.body.anonymous : false;
    const reviewRequest = req.body.reviewRequest;
    const uuidComment = req.body.uuidComment;
    const uuidParentComment = req.params.uuid;
    const content = req.body.content.trim();
    const userId = await User.findById( req.body.userId ).exec();
    const childComment = new Comment({ userId , content, reviewRequest, commentFlag, uuidComment, anonymousFlag });
    const newComment = await childComment.save();
    await Comment.findOneAndUpdate(
      { uuidComment: uuidParentComment },
      { $push: { childComment: newComment } }
    );
    res.status(201).json({ success: true })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getComments: getComments,
  createArticleComment: createArticleComment,
  updateComment: updateScoreVote,
  updateCommentContent: updateComment,
  findCommentAndDelete: findCommentAndDelete,
  answerComment: answerComment
};
