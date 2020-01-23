const PartialReview = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function create({ userId, articleId, partialReview }, child = false) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	const newPartialReview = new PartialReview({
		userId,
		...partialReview
	});
	await newPartialReview.save();
	if (!child) {
		article.partialReviews.push(newPartialReview._id);
	}
	await article.save();
	await newPartialReview.populate('userId').execPopulate();
	return newPartialReview;
}

module.exports = create;
