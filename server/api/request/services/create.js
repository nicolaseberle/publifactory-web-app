const { Request } = require('../model');
const sendEmail = require('./send-email');
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
		sendEmail(newRequest);
	}
	return newRequest;
}

module.exports = create;
