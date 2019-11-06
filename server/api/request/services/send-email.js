const { Request } = require('../model/index');
const Email = require('../../email/email.controller');

async function sendEmail(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	const email = new Email(request.reviewer.email);
	email.sendReviewerMail(
		{
			requestId: request._id,
			content: request.content,
			subject: request.subject
		},
		(err, info) => {
			if (err) {
				request.history.push({
					status: 'bademail',
					date: new Date().toUTCString()
				});
				return;
			}
			request.history.push({
				status: 'sent',
				date: new Date().toUTCString()
			});
			request.save();
		}
	);
}

module.exports = sendEmail;
