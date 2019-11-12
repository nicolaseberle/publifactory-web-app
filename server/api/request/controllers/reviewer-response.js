const serviceUpdate = require('../services/update');
const { emailReviewerTemplate } = require('../../../config/emailing/');

async function reviewerReponse(req, res, next) {
	try {
		const response = await serviceUpdate(req.params.requestId, {
			status: req.params.status
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = reviewerReponse;
