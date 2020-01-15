const serviceList = require('../services/list');
const { ApiError } = require('../../../config/error');

async function list(req, res, next) {
	try {
		if (!req.params.articleId) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceList({ articleId: req.params.articleId });
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = list;
