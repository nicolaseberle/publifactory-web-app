const { Request } = require('../model');
const Email = require('../../email/email.controller');

async function create({ reviewer, editor, ...request }) {
	console.log(reviewer, editor, request);
	const newRequest = new Request({
		reviewer,
		editor,
		...request
	});
	newRequest.history.push({
		status: 'pending',
		date: new Date().toUTCString()
	});

	if (newRequest.reviewer.email) {
		const email = new Email(newRequest.reviewer.email);

		// Todo validate async
		email.sendReviewerMail(
			{ content: newRequest.content, subject: newRequest.object },
			(err, info) => {
				if (err) {
					console.log('ERROR=>', err);
					// TODO set something on request ~ emailFailed || emailVerified
					return;
				}
				newRequest.history.push({
					status: 'sent',
					date: new Date().toUTCString()
				});
			}
		);
	}
	await newRequest.save();
	return newRequest;
}

module.exports = create;
