const { Request } = require('../model/index');
const Email = require('../../email/email.controller');
const { emailReviewerTemplate } = require('../../../config/emailing');

async function sendEmailReviewer(requestId, remind = false) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	const email = new Email(request.reviewer.email);
	await email.sendEmailRequestReviewer(
		request,
		emailReviewerTemplate.redirect(request)
	);
}

module.exports = sendEmailReviewer;
