const serviceReadByTitle = require('../services/readByTitle');

async function readByTitle(req, res, next) {
	try {
		if (!req.params.publisherId || !req.params.invitationReviewerTitle)
			throw { code: 422, message: 'Missing parameters.' };

		const response = await serviceReadByTitle(
			req.params.publisherId,
			req.params.invitationReviewerTitle
		);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = readByTitle;
