const { Request } = require('../model');
const sendEmailReviewer = require('./send-email-reviewer');
const Email = require('../../email/email.controller');

async function create({ reviewer, editor, ...request }) {
	const newRequest = new Request({
		reviewer,
		editor,
		...request
	});
	newRequest.history.push({
		status: 'pending',
		date: new Date().toUTCString()
	});

	await newRequest.save();
	if (newRequest.reviewer.email) {
		sendEmailReviewer(newRequest);
	}
	return newRequest;
}

module.exports = create;
