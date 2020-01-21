const PartialReview = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function removeChild(childId) {
	const child = await PartialReview.findById(childId).populate('child');
	if (child && child.child) {
		await Promise.all(child.child.map(async c => await removeChild(c)));
	}
	await PartialReview.deleteOne({ _id: childId });
}

async function remove({ userId, articleId, partialReviewId }) {
	const article = await Article.findById(articleId);
	const partialReview = await PartialReview.findById(partialReviewId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!partialReview) throw new ApiError('REVIEW_NOT_FOUND');
	if (userId !== partialReview.userId.toString()) {
		throw new ApiError('REVIEW_FORBIDEN_OPERATION');
	}
	article.partialReviews.filter(id => id.toString() !== partialReviewId);
	article.save();
	await Promise.all(partialReview.child.map(async c => await removeChild(c)));
	await PartialReview.deleteOne({ _id: partialReview._id });
	return partialReview;
}

module.exports = remove;
