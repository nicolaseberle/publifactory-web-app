const PartialReview = require('../model');
const create = require('./create');
const { ApiError } = require('../../../config/error');

async function addChild({ partialReviewId }) {
	const parentPartialReview = await PartialReview.findById(partialReviewId);
	if (!parentPartialReview) throw new ApiError('PARTIAL_REVIEW_NOT_FOUND');
	const childPartialReview = await create(arguments[0], true);
	parentPartialReview.child.push(childPartialReview);
	await parentPartialReview.save();
	return childPartialReview;
}

module.exports = addChild;
