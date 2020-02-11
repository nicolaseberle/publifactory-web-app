const serviceRemove = require('../services/remove');
const { ApiError } = require('../../../config/error');

async function remove(req, res, next) {
	try {
		if (!req.params.journalId || !req.params.userId)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceRemove({
			userId: req.params.userId,
			journalId: req.params.journalId,
			billing: req.body
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = remove;
