const PartialReview = require('../model');
const { ApiError } = require('../../../config/error');

async function update({ userId, partialReviewId, partialReview }) {
	const updatePartialReview = await PartialReview.findById(partialReviewId);
	if (!updatePartialReview) throw new ApiError('REVIEW_NOT_FOUND');
	const mergePartialReview = { ...updatePartialReview.toObject(), ...partialReview };
	await updatePartialReview.updateOne({ $set: mergePartialReview }, { runValidators: true });
	return updatePartialReview;
}

module.exports = update;
