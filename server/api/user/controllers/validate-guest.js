const serviceValidateGuest = require('../services/validate-guest');
const { ApiError } = require('../../../config/error');

async function validateGuest(req, res, next) {
	try {
		if (!req.body.token || !req.params.state || !req.body.password)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceValidateGuest({
			...req.body,
			state: req.params.state
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = validateGuest;
