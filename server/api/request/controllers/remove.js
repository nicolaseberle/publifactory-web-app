const serviceRemove = require('../services/remove');

async function remove(req, res, next) {
	try {
		if (!req.params.requestId)
			throw { code: 422, message: 'Missing parameters.' };
		await serviceRemove(req.params.requestId);
		res.status(200).end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = remove;
