const Review = require('../model');
const { ApiError } = require('../../../config/error');

async function read({ reviewId }) {
	const review = await Review.findById(reviewId).populate('userId child');
	if (!review) throw new ApiError('REVIEW_NOT_FOUND');
	return review;
}

module.exports = read;
