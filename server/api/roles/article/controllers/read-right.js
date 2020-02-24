const serviceReadRight = require('../services/article-get-role');
const { ApiError } = require('../../../../config/error');

async function readRight(req, res, next) {
	try {
		if (!req.params.articleId) throw new ApiError('BAD_PARAMETERS');
		const response = serviceReadRight({
			userId: req.decoded._id,
			articleId: req.params.articleId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = readRight;
