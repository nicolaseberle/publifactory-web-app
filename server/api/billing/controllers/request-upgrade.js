const serviceRequestUpgrade = require('../services/request-upgrade');
const { ApiError } = require('../../../config/error');

async function requestUpgrade(req, res, next) {
	try {
		if (!req.params.journalId) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceRequestUpgrade({
			userId: req.decoded._id,
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

module.exports = requestUpgrade;
