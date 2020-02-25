'use strict';

const mongoose = require('mongoose');
var User = require('../user/user.model');
var Article = require('./article.model');
const RolesArticle = require('../roles/article/roles.article.model');
var Data = require('../data/data.model');
const { ApiError } = require('../../config/error');

var validationError = function(res, err) {
	return res.status(422).json(err);
};

/**
 * Get list of articles
 * restriction: 'admin'
 */

// const Category = require('../category/category.model');

// const ArticleValidator = require('./article.validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 * @function getArticles
 * @description This function is used to get all the articles from the database
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<*>}
 */
exports.getArticles = async function(req, res, next) {
	const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
	const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
	let options = { deleted: false, published: true };
	if (req.query.status) {
		options = { deleted: false, published: true, status: req.query.status };
	}
	try {
		const articles = await Article.paginate(options, {
			page,
			limit,
			populate: 'authors.author reviewers',
			lean: true
		});
		renameObjectProperty(articles, 'docs', 'articles');
		return res.json(articles);
	} catch (err) {
		next(err);
	}
};

/**
 * @function getMyArticles
 * @description This function is used to get the articles of the user
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<*>}
 */
exports.getMyArticles = async function(req, res, next) {
	const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
	const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
	try {
		const articles = await Article.paginate(
			{
				$or: [
					{ 'authors.author': req.decoded._id },
					{ reviewers: req.decoded._id }
				]
			},
			{ page, limit, populate: 'authors.author reviewers', lean: true }
		);
		renameObjectProperty(articles, 'docs', 'articles');
		return res.status(200).json(articles);
	} catch (err) {
		return next(err);
	}
};

/**
 * @function findArticleById
 * @description This function is used to find an article by its id.
 * This function only takes the article's id in the url parameter field.
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<*>}
 */
module.exports.findArticleById = async function(req, res, next) {
	try {
		const article = await Article.findById(req.params.id)
			.populate('authors.author reviewers')
			.lean();
		if (!article) return res.sendStatus(404);
		return res.status(200).json(article);
	} catch (err) {
		next(err);
	}
};

/**
 * @function findArticleBySlugAndUpdate
 * @description This function is used to modify the content of an article
 * This function take several parameters in the body field :
 *  - title, the new title of the article
 *  - abstract, the new abstract of the article
 *  - arr_content, the new content of the article
 *  - content, the new LaTeX content of the article
 *  - status, the new status of the article
 *  - published, a boolean which define if the article is in public or private mode
 *  - tags, a list of tags to set on the article
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleByIdAndUpdate = async function(req, res, next) {
	try {
		if (
			req.body.title === undefined ||
			req.body.abstract === undefined ||
			req.body.arr_content === undefined ||
			req.body.content === undefined ||
			req.body.status === undefined ||
			req.body.published === undefined ||
			req.body.tags === undefined
		) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const title = req.body.title.trim();
		const abstract = req.body.abstract;
		const content = req.body.content;
		const arr_content = req.body.arr_content;
		const tags = req.body.tags;
		const published = req.body.published;
		const article = await Article.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { title, abstract, content, arr_content, tags, published } },
			{ new: true }
		);
		if (!article) return res.sendStatus(404);
		return res.json(article);
	} catch (err) {
		console.log(err);
		return next(err);
	}
};

/**
 * @function findArticlebyIdAndUpdateReferences
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticlebyIdAndUpdateReferences = async function(
	req,
	res,
	next
) {
	try {
		if (req.body.references === undefined) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const references = req.body.references;
		console.log(references);
		const article = await Article.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { references } }
		);
		console.log('Update=>', article.references);
		if (!article) return res.sendStatus(404);

		return res.json(article);
	} catch (err) {
		console.log('ERR:', err);
		return next(err);
	}
};

/**
 * @function deleteArticle
 * @description This function is used to delete the article from the database
 * This function only take the targeted article's id
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.deleteArticle = async function(req, res, next) {
	try {
		Article.findOneAndRemove({ _id: req.params.id }).exec();
		res.sendStatus(204);
	} catch (err) {
		return next(err);
	}
};

/**
 * @function updateAuthorOfArticle
 * @description This function is used to update the authors's rights of an article
 * This function only take an author list in the body field as parameter.
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.updateAuthorOfArticle = async function(req, res, next) {
	try {
		if (req.body.authors === undefined) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const authors = req.body.authors;
		const article = await Article.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: { authors } },
			{ new: true }
		);
		if (!article) return res.sendStatus(404);
		return res.json(article);
	} catch (err) {
		return next(err);
	}
};

/**
 * @function addAuthorOfArticle
 * @description This function is used to add an author to the authors's list of an article
 * This function only take an author object in the body field as parameter which precise :
 *  - email, the email of the user
 *  - rank, the rank of the user in the article
 *  - role, the role of the user in the article
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.addAuthorOfArticle = async function(req, res, next) {
	try {
		if (req.body.author === undefined) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const author = await User.findOne({ email: req.body.author.email }).exec();
		const newAuthor = {
			_id: author._id,
			rank: req.body.author.rank,
			role: req.body.author.role,
			author: author
		};
		await Article.findOneAndUpdate(
			{ _id: req.params.id },
			{ $push: { authors: newAuthor } },
			{ new: true }
		);
		new RolesArticle({
			id_user: author._id,
			id_article: req.params.id,
			right: 'author'
		}).save();
		return res.status(201).json({ success: true });
	} catch (err) {
		return next(err);
	}
};

/**
 * @function addAuthorOfArticle
 * @description This function is used to remove an author to the authors's list of an article
 * This function only take an user's id in the body field as parameter.
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.removeAuthorOfArticle = async function(req, res, next) {
	try {
		if (req.body.authorId === undefined) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		await Article.findOneAndUpdate(
			{ _id: req.params.id },
			{ $pull: { authors: { _id: req.body.authorId } } },
			{ multi: false }
		);
		const query = { id_user: req.body.authorId, id_article: req.params.id };
		const toReplace = { $set: { right: 'guest' } };
		await RolesArticle.updateOne(query, toReplace);
		res.status(204);
	} catch (err) {
		next(err);
	}
};

/**
 * @function createArticle
 * @description This function is used to create a new article in the database.
 * This function take several parameters in the body parameters :
 *  - title, the tile of the new article
 *  - abstract, the abstract of the new article
 *  - arr_content, the blocks and content of the new article
 *  - content, the LaTeX content of the new article
 *  - status, the status of the new article (draft by default)
 *  - published, a boolean value to know if the new article is public or private
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createArticle = async function(req, res, next) {
	try {
		if (
			req.body.title === undefined ||
			req.body.abstract === undefined ||
			req.body.arr_content === undefined ||
			req.body.content === undefined ||
			req.body.status === undefined ||
			req.body.published === undefined
		) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const title = req.body.title.trim();
		const abstract = req.body.abstract.trim();
		const arr_content = req.body.arr_content;
		const content = req.body.content;
		const status = req.body.status;
		const published = req.body.published;

		const newArticle = new Article({
			title,
			abstract,
			content,
			arr_content,
			status,
			published
		});
		const author = await User.findById(req.decoded._id).exec();
		// console.log(JSON.stringify(author, null, "\t"));
		newArticle.authors[0] = { rank: 1, role: 'Lead', author: author };
		const article = await newArticle.save();
		new RolesArticle({
			id_user: req.decoded._id,
			id_article: article._id,
			right: 'author'
		}).save();

		// console.log(JSON.stringify(article._id, null, "\t"));

		res.status(201).json(article._id);
	} catch (err) {
		next(err);
	}
};

/**
 * @function changeStatus
 * @description This function is used to change the status of an article
 * This function just take an id of the article and a status in the parameter's
 * url field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.changeStatus = async function(req, res, next) {
	try {
		const query = { _id: req.params.id };
		const article = await Article.findById(req.params.id, {
			_id: false,
			authors: true
		});
		const isLead = article.authors.filter(
			author =>
				author.author.toString() === req.decoded._id &&
				author.rank === 1 &&
				author.role === 'Lead'
		);
		if (!isLead) throw { code: 400, message: 'ARTICLE_AUTHOR_NEED_LEAD' };
		const status = { status: req.params.status };
		await Article.updateOne(query, { $set: status });
		res.status(200).json({ success: true });
	} catch (e) {
		next(e);
	}
};

/**
 * @function updateAuthorRights
 * @description This function is used to update the author's rights on an article
 * This function just take the list of the authors as parameters in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.updateAuthorRights = async function(req, res, next) {
	try {
		if (req.body.newAuthors === undefined) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const query = { _id: req.params.id };
		const toReplace = { $set: { authors: req.body.newAuthors } };
		await Article.updateOne(query, toReplace);
		res.status(201).json({ success: true });
	} catch (e) {
		next(e);
	}
};

/**
 * @function addReviewer
 * @description This function is used to add a new reviewer on the article.
 * This function just take a reviewer as parameter in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.addReviewer = async function(req, res, next) {
	try {
		if (req.body.reviewer === undefined) {
			throw { success: false, message: 'Missing parameters in body field.' };
		}
		const user = await User.findOne({ email: req.body.reviewer.email }).exec();
		const query = { _id: req.params.id };
		const toAdd = { $push: { reviewers: user._id } };
		const options = { new: true };
		await Article.findOneAndUpdate(query, toAdd, options);
		new RolesArticle({
			id_user: user._id,
			id_article: req.params.id,
			right: 'reviewer'
		}).save();
		res.json({ success: true });
	} catch (e) {
		next(e);
	}
};

/**
 * @function addAssociateEditor
 * @description This function is used to add a new associate_editor on the article.
 * This function just take an associate_editors as parameter in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.addAssociateEditor = async function(req, res, next) {
	try {
		if (req.body.associate_editors === undefined) {
			throw { success: false, message: 'Missing parameters in body field.' };
		}
		const user = await User.findOne({
			email: req.body.associate_editors.email
		}).exec();
		new RolesArticle({
			id_user: user._id,
			id_article: req.params.id,
			right: 'associate_editor'
		}).save();
		res.json({ success: true });
	} catch (e) {
		next(e);
	}
};

/**
 * @function createVersion
 * @description This function is used to create a new version of the article, to
 * make backup if needed.
 * This function takes several parameters in the body field :
 *  - name, which is the name of the new version
 *  - title, the current title of the article
 *  - abstract, the current abstract of the article
 *  - arr_content, the current content of the article
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
module.exports.createVersion = async function(req, res, next) {
	try {
		if (
			req.body.name === undefined ||
			req.body.title === undefined ||
			req.body.abstract === undefined ||
			req.body.arr_content === undefined
		) {
			throw { code: 422, message: 'Missing parameters.' };
		}
		const newVersion = {
			name: req.body.name,
			title: req.body.title,
			abstract: req.body.abstract,
			arr_content: req.body.arr_content,
			date: new Date()
		};
		const query = {
			_id: req.params.id
		};
		const toPush = {
			$push: { version: newVersion }
		};
		const options = {
			new: true
		};
		await Article.findOneAndUpdate(query, toPush, options).exec();
		res.status(201).json({ success: true });
	} catch (e) {
		next(e);
	}
};
