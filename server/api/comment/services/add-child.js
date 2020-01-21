const Review = require('../model');
const create = require('./create');
const { ApiError } = require('../../../config/error');

async function addChild({ userId, articleId, reviewId, review }) {
	const parentReview = await Review.findById(reviewId);
	if (!parentReview) throw new ApiError('REVIEW_NOT_FOUND');
	const childReview = await create(arguments[0], true);
	parentReview.child.push(childReview);
	await parentReview.save();
	return childReview;
}

module.exports = addChild;