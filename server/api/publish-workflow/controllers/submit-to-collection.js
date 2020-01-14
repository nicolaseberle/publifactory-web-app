const serviceSubmitToCollection = require('../services/submit-to-collection');
const { ApiError } = require('../../../config/error');

async function submitToCollection(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.journalId) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceSubmitToCollection({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			journalId: req.params.journalId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = submitToCollection;
