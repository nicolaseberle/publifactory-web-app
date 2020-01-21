const serviceRead = require('../services/read');
const { ApiError } = require('../../../config/error');

async function read(req, res, next) {
	try {
		if (!req.params.reviewId) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceRead({
			reviewId: req.params.reviewId
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