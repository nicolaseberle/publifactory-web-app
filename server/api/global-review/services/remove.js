const GlobalReview = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function remove({ userId, articleId, globalReviewId }) {
	const article = await Article.findById(articleId);
	const globalReview = await GlobalReview.findById(globalReviewId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!globalReview) throw new ApiError('GLOBAL_REVIEW_NOT_FOUND');
	if (userId !== globalReview.userId.toString()) {
		throw new ApiError('GLOBAL_REVIEW_FORBIDEN_OPERATION');
	}
	article.globalReviews.filter(id => id.toString() !== globalReviewId);
	await GlobalReview.deleteOne({ _id: globalReview._id });
	await article.save();
	return globalReview;
}

module.exports = remove;
