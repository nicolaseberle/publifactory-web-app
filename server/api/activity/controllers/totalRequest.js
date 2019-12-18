const serviceList = require('../services/totalRequest');

async function totalRequest(req, res, next) {
	try {
		const response = await serviceList();
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = totalRequest;
