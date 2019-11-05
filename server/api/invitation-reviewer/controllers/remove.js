const serviceRemove = require('../services/remove');

async function remove(req, res, next) {
	try {
		if (!req.params.invitationReviewerId)
			throw { code: 422, message: 'Missing parameters.' };

		const response = await serviceRemove(req.params.invitationReviewerId);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = remove;
