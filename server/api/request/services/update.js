const { Request } = require('../model/');
const { emailEditorTemplate } = require('../../../config/emailing');
const Email = require('../../email/email.controller');

function getRawStatus(history) {
	return history.reduce((acc, request) => [...acc, request.status], []);
}

function updateStatus(request, status) {
	const rawStatus = getRawStatus(request.history);
	if (rawStatus.includes('done')) throw new Error('REQUEST_ALREADY_DONE');
	request.history.push({
		status,
		date: new Date().toUTCString()
	});
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

	const email = new Email(updatedRequest.editor.email);
	// send an email to the editor if the status === accept/rejected/outfield
	if (status && status === 'accepted') {
		email.sendEmail({
			subject: 'A reviewer accepted to review your article',
			html: emailEditorTemplate.answer(updatedRequest, status)
		});
	} else if ((status && status === 'rejected') || status === 'outfield') {
		email.sendEmail({
			subject: 'A reviewer rejected to review your article',
			html: emailEditorTemplate.answer(updatedRequest, status)
		});
	}
	return mergedRequest;
}

module.exports = update;
