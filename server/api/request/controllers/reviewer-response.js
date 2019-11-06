const serviceUpdate = require('../services/update');
const { emailReviewerTemplate } = require('../../../config/emailing/');

async function reviewerReponse(req, res, next) {
	try {
		await serviceUpdate(req.params.requestId, { status: req.params.status });
		return res.status(200).send(emailReviewerTemplate[req.params.status]);
	} catch (error) {
		if ((error.message = 'REQUEST_FORBIDEN_UPDATE_DONE')) {
			return res.status(200).send(emailReviewerTemplate['alreadyAnswered']);
		}
		console.log('ERROR=>', error);
		return next(error);
	}
}

module.exports = reviewerReponse;
