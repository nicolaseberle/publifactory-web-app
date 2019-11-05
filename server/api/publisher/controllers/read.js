const serviceRead = require('../services/read');

async function read(req, res, next) {
	try {
		if (!req.params.publisherId)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceRead(req.params.publisherId);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = read;
