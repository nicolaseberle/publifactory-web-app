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
    console.log('getArticleComments');
    const article = await Article.findOne({ _id: req.params.id })
      .populate({
        path: 'comments',
        populate: { path: 'userId' }
      })
      .lean();

    if (!article) return res.boom.notFound();

    const comments = await article.comments;
    console.log(comments);

    //const comments = await Comment.paginate({ article }, { page, limit, lean: true });
    renameObjectProperty(comments, 'docs', 'comments');

    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
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
  } catch (err) {
    return next(err);
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
    console.log('createArticleComment');
    const commentFlag = req.body.commentFlag;
    const anonymousFlag = req.body.anonymousFlag;
    const reviewRequest = req.body.reviewRequest;
    const uuidComment = req.body.uuidComment;
    const content = req.body.content.trim();
    const userId = await User.findById( req.body.userId ).exec();
    const newComment = new Comment({ userId , content, reviewRequest, commentFlag, uuidComment, anonymousFlag });
    const comment = await newComment.save();

    //console.log('newComment : ' + comment);
    // article.comments.push(comment);
    // await article.save();
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment._id } }
    );
    // if it's a review
    if(commentFlag == false) {
      article.nbReviews = article.nbReviews + 1;
      await article.save();

    }// else it's a comment
    else {
      article.nbComments = article.nbComments + 1;
      await article.save();
    }

    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
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
    console.log('updateScores');
    const upvote = req.body.upvote;
    const downvote = req.body.downvote;
    console.log(upvote,downvote);
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.uuid },
      { $inc: { 'scores.upvote': upvote,'scores.downvote': downvote} }
    ).exec();

    return res.json(comment);
  } catch (err) {
    return next(err);
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
      throw { code: 422, message: "Missing parameter in the body field." };
    const toFind = { _id: req.params.uuid };
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
    const comment = await Comment.delete({ _id: req.params.uuid });

    if (comment.n === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getArticleComments: getArticleComments,
  getArticleComment: getArticleComment,
  createArticleComment: createArticleComment,
  updateComment: updateScoreVote,
  updateCommentContent: updateComment,
  findCommentAndDelete: findCommentAndDelete
};
