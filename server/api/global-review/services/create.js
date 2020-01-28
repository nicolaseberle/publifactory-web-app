const GlobalReview = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function create({ userId, articleId, globalReview }) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	const newGlobalReview = new GlobalReview({
		user: userId,
		...globalReview
	});
	await newGlobalReview.save();
	article.globalReviews.push(newGlobalReview._id);
	await article.save();
	await newGlobalReview.populate('user').execPopulate();
	return newGlobalReview;
}

module.exports = create;
