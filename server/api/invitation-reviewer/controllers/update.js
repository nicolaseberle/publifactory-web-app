const serviceUpdate = require('../services/update');

async function update(req, res, next) {
	try {
		if (!req.params.invitationReviewerId)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceUpdate(
			req.params.invitationReviewerId,
			req.body
		);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = update;
