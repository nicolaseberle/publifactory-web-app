const serviceCreateGuest = require('../services/create-guest');
const { ApiError } = require('../../../config/error');

async function createGuest(req, res, next) {
	try {
		if (!req.body.email || !req.body.firstName || !req.body.lastName)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceCreateGuest({
			...req.body
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = createGuest;
