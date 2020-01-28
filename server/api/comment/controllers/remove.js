const serviceRemove = require('../services/remove');
const { ApiError } = require('../../../config/error');

async function remove(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.partialReviewId)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceRemove({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			partialReviewId: req.params.partialReviewId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = remove;
