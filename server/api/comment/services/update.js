const Review = require('../model');
const { ApiError } = require('../../../config/error');

async function update({ userId, reviewId, review }) {
	const updateReview = await Review.findById(reviewId);
	if (!updateReview) throw new ApiError('REVIEW_NOT_FOUND');
	const mergeReview = { ...updateReview.toObject(), ...review };
	await updateReview.updateOne({ $set: mergeReview }, { runValidators: true });
	return updateReview;
}

module.exports = update;
