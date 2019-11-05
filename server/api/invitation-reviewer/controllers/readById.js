const serviceReadById = require('../services/readById');

async function readById(req, res, next) {
	try {
		console.log('READBYID');
		if (!req.params.invitationReviewerId)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceReadById(req.params.invitationReviewerId);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = readById;
