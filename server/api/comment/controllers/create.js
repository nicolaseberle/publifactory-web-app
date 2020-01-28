const serviceCreate = require('../services/create');
const serviceAddChild = require('../services/add-child');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		if (!req.body.content) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const params = {
			userId: req.decoded._id,
			partialReview: req.body,
			articleId: req.params.articleId
		};
		const response = req.params.partialReviewId
			? await serviceAddChild({
					...params,
					partialReviewId: req.params.partialReviewId
			  })
			: await serviceCreate(params);

		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = create;
