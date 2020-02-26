const { Request } = require('../model/index');
const Email = require('../../email/email.controller');
const { emailReviewerTemplate } = require('../../../config/emailing');
const { ApiError } = require('../../../config/error');

async function sendEmailReviewer(requestId, remind = false) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	const email = new Email(request.reviewer.email);
	try {
		await email.sendEmailRequestReviewer(
			request,
			emailReviewerTemplate.redirect(request)
		);
	} catch (error) {
		throw new ApiError('INVALID_EMAIL');
	}
}

module.exports = sendEmailReviewer;
