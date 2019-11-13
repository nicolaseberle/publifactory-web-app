const serviceRead = require('../services/read');

async function read(req, res, next) {
	try {
		if (!req.params.requestId)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceRead(req.params.requestId);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = read;
