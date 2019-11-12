const { Request } = require('../model/');
const sendEmailReviewer = require('./send-email-reviewer');
const sendEmailEditor = require('./send-email-editor');

function getRawStatus(history) {
	return history.reduce((acc, request) => [...acc, request.status], []);
}

function getRemindCount(history) {
	return history.reduce((acc, request) => {
		return request.status === 'remind' ? (acc += 1) : acc;
	}, 0);
}

// todo move status update here =>
function updateStatus(request, status) {
	const rawStatus = getRawStatus(request.history);
	if (rawStatus.includes('done')) throw new Error('REQUEST_ALREADY_DONE');
	request.history.push({
		status,
		date: new Date().toUTCString()
	});
	const remindCount = getRemindCount(request.history);
	if (remindCount >= request.remindMax) {
		request.history.push(
			{
				status: 'rejected',
				date: new Date().toUTCString()
			},
			{ status: 'done', data: new Date().toUTCString() }
		);
	}
	request.remindCount = remindCount;
	if (
		status === 'accepted' ||
		status === 'rejected' ||
		status === 'outfield' ||
		status === 'unsubscribed'
	) {
		request.history.push({
			status: 'done',
			data: new Date().toUTCString()
		});
	}
}

function shouldSendEmailReviewer(oldRequest, incomingRequest, status) {
	if (status === 'remind') {
		sendEmailReviewer(oldRequest._id);
		return;
	}
	if (!incomingRequest.reviewer.email) return;
	if (oldRequest.reviewer.email === incomingRequest.reviewer.email) return;
	sendEmailReviewer(oldRequest._id);
}

async function update(requestId, { reviewer, editor, status, ...request }) {
	const updatedRequest = await Request.findById(requestId);
	if (!updatedRequest) throw new Error('REQUEST_NOT_FOUND');

	if (status) {
		updateStatus(updatedRequest, status);
	}

	const updateReviewer = { ...updatedRequest.reviewer.toObject(), ...reviewer };
	const updateEditor = { ...updatedRequest.editor.toObject(), ...editor };
	const mergedRequest = {
		...updatedRequest.toObject(),
		...request,
		editor: updateEditor,
		reviewer: updateReviewer
	};
	await updatedRequest.updateOne(
		{ $set: mergedRequest },
		{ runValidators: true }
	);
	// Should send an email if a new email was added or remind as status
	shouldSendEmailReviewer(updatedRequest, mergedRequest, status);

	// send an email to the editor if the status === accept/rejected/outfield
	if (
		(status && status === 'accepted') ||
		status === 'rejected' ||
		status === 'outfield'
	)
		sendEmailEditor(updatedRequest._id);
	return mergedRequest;
}

module.exports = update;
