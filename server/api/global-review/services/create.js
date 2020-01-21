const GlobalReview = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function create({ userId, articleId, partialReview }, child = false) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	const newGlobalReview = new GlobalReview({
		userId,
		...partialReview
	});
	await newGlobalReview.save();
	await article.save();
	await newGlobalReview.populate('userId').execPopulate();
	return newGlobalReview;
}

module.exports = create;
