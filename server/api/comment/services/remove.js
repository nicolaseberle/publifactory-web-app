const Review = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function removeChild(childId) {
	const child = await Review.findById(childId).populate('child');
	if (child && child.child) {
		await Promise.all(child.child.map(async c => await removeChild(c)));
	}
	await Review.deleteOne({ _id: childId });
}

async function remove({ userId, articleId, reviewId }) {
	const article = await Article.findById(articleId);
	const review = await Review.findById(reviewId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!review) throw new ApiError('REVIEW_NOT_FOUND');
	if (userId !== review.userId.toString()) {
		throw new ApiError('REVIEW_FORBIDEN_OPERATION');
	}
	article.reviews.filter(id => id.toString() !== reviewId);
	article.save();
	await Promise.all(review.child.map(async c => await removeChild(c)));
	await Review.deleteOne({ _id: review._id });
	return review;
}

module.exports = remove;
