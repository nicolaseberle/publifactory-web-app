const { ApiError } = require('../../../config/error');
const serviceRead = require('../services/read');

async function read(req, res, next) {
	try {
		if (!req.params.billingId) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceRead({
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

module.exports = read;
