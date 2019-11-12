const { Request } = require('../model/index');
const Email = require('../../email/email.controller');
const { emailReviewerTemplate } = require('../../../config/emailing');

async function sendEmailReviewer(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	const email = new Email(request.reviewer.email);
	email.sendEmailRequestReviewer(
		request,
		emailReviewerTemplate.redirect(request),
		(err, info) => {
			err
				? request.history.push({
						status: 'bademail',
						date: new Date().toUTCString()
				  })
				: request.history.push({
						status: 'sent',
						date: new Date().toUTCString()
				  });
			request.save();
		}
	);
}

module.exports = sendEmailReviewer;
