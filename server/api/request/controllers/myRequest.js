const serviceList = require('../services/myRequest');

async function myRequest(req, res, next) {
	try {
		if (!req.params.userId)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceList(req.params.userId,{
			page: req.query.page ? parseInt(req.query.page, 10) : undefined,
			count: req.query.count ? parseInt(req.query.count, 10) : undefined,
			filters: req.query
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log(error)
		next(error);
	}
}

module.exports = myRequest;
