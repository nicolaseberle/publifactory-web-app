const PartialReview = require('../model');
const { ApiError } = require('../../../config/error');

async function read({ partialReviewId }) {
	const partialReview = await PartialReview.findById(partialReviewId).populate('userId child');
	if (!partialReview) throw new ApiError('REVIEW_NOT_FOUND');
	return partialReview;
}

module.exports = read;
