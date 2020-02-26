const { ApiError } = require('../../../config/error');
const serviceList = require('../services/list');

async function list(req, res, next) {
	if (!req.query.title) throw new ApiError('BAD_PARAMETERS');
	try {
		const response = await serviceList({
			count: req.query.count ? parseInt(req.query.count, 10) : undefined,
			title: req.query.title
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = list;
