const { Publisher } = require('../../publisher/model');
const { InvitationReviewer } = require('../../invitation-reviewer/model');
const { Request } = require('../model');
const createPublisher = require('../../publisher/services/create');
const createInvitationReviewer = require('../../invitation-reviewer/services/create');

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
	await newRequest.save();
	return newRequest;
}

module.exports = create;
