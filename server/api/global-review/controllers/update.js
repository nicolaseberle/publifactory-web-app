const serviceUpdate = require('../services/update');
const { ApiError } = require('../../../config/error');

async function update(req, res, next) {
	try {
		if (!req.params.globalReviewId) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceUpdate({
			userId: req.decoded._id,
			globalReview: req.body,
			globalReviewId: req.params.globalReviewId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = update;
