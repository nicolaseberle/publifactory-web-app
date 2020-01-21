const serviceRemove = require('../services/remove');
const { ApiError } = require('../../../config/error');

async function remove(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.globalReviewId)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceRemove({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			globalReviewId: req.params.globalReviewId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log(error);
		return next(error);
	}
}

module.exports = remove;
