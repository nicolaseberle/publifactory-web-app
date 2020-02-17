const { ApiError } = require('../../../config/error');
const serviceUnsubscribe = require('../services/unsubscribe');

async function unsubscribe(req, res, next) {
	try {
		if (!req.params.billingId) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceUnsubscribe({
			billingId: req.params.billingId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = unsubscribe;
