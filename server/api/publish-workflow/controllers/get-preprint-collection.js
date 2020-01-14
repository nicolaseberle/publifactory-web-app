const serviceGetPreprintCollection = require('../services/get-preprint-collection');

async function getPreprintCollection(req, res, next) {
	try {
		const response = await serviceGetPreprintCollection(true);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = getPreprintCollection;
