const serviceCreate = require('../services/create');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		if (!req.body.contentForAuthor && !req.body.contentForEditor) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const params = {
			userId: req.decoded._id,
			globalReview: req.body,
			articleId: req.params.articleId
		};
		const response = await serviceCreate(params);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = create;
