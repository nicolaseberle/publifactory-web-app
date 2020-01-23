const GlobalReview = require('../model');
const { ApiError } = require('../../../config/error');

async function update({ userId, globalReviewId, globalReview }) {
	const updateGlobalReview = await GlobalReview.findById(globalReviewId);
	if (!updateGlobalReview) throw new ApiError('GLOBAL_REVIEW_NOT_FOUND');
	const mergeGlobalReview = {
		...updateGlobalReview.toObject(),
		...globalReview
	};
	await updateGlobalReview.updateOne(
		{ $set: mergeGlobalReview },
		{ runValidators: true }
	);
	return updateGlobalReview;
}

module.exports = update;
