const GlobalReview = require('../model');
const { ApiError } = require('../../../config/error');

async function update({ userId, partialReviewId, partialReview }) {
	const updateGlobalReview = await GlobalReview.findById(partialReviewId);
	if (!updateGlobalReview) throw new ApiError('GLOBAL_REVIEW_NOT_FOUND');
	const mergeGlobalReview = { ...updateGlobalReview.toObject(), ...partialReview };
	await updateGlobalReview.updateOne({ $set: mergeGlobalReview }, { runValidators: true });
	return updateGlobalReview;
}

module.exports = update;
