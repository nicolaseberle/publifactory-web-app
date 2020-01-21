const GlobalReview = require('../model');
const { ApiError } = require('../../../config/error');

async function read({ globalReviewId }) {
	const globalReview = await GlobalReview.findById(globalReviewId).populate('userId');
	if (!globalReview) throw new ApiError('GLOBAL_REVIEW_NOT_FOUND');
	return globalReview;
}

module.exports = read;
