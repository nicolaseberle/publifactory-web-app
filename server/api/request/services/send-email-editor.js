const { Request } = require('../model/index');
const Email = require('../../email/email.controller');
const { emailReviewerTemplate } = require('../../../config/emailing');

async function sendEmailEditor(requestId, status) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	const email = new Email(request.reviewer.email);
	email.sendEmailRequestEditor(
		request,
		emailReviewerTemplate.editor(request, status)
	);
}

module.exports = sendEmailEditor;
