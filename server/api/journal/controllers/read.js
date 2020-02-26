const serviceRead = require('../services/read');

async function read(req, res, next) {
	try {
		const response = await serviceRead(req.params.id);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = read;
