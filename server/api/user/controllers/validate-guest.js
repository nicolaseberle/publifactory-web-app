const serviceValidateGuest = require('../services/validate-guest');
const { ApiError } = require('../../../config/error');

async function validateGuest(req, res, next) {
	try {
		if (!req.body.token) throw new ApiError('BAD_PARAMETERS');
		const response = await serviceValidateGuest({
			token: req.body.token
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
