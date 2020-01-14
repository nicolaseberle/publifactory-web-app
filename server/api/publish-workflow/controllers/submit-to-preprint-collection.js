const serviceSubmitToPreprintCollection = require('../services/submit-to-preprint-collection');
const { ApiError } = require('../../../config/error');

async function submitToPreprintCollection(req, res, next) {
	try {
		if (!req.params.articleId) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceSubmitToPreprintCollection(
			req.params.articleId
		);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = submitToPreprintCollection;
