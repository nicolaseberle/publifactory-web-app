const serviceList = require('../services/occurencebydate');

async function list(req, res, next) {
	try {
		const response = await serviceList({
			page: req.query.page ? parseInt(req.query.page, 10) : undefined,
			count: req.query.count ? parseInt(req.query.count, 10) : undefined,
			filters: req.query
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = list;
