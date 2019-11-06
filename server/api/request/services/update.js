const { Request } = require('../model/');
const sendEmail = require('./send-email');

function getRawStatus(history) {
	return history.reduce((acc, request) => {
		return (acc = [...acc, request.status]);
	}, []);
}

function getRemindCount(history) {
	return history.reduce((acc, request) => {
		return request.status === 'remind' ? (acc += 1) : acc;
	}, 0);
}

function shouldSendEmail(oldRequest, incomingRequest) {
	if (!incomingRequest.reviewer.email) return;
	if (oldRequest.reviewer.email === incomingRequest.reviewer.email) return;
	sendEmail(oldRequest._id);
}

async function update(requestId, { reviewer, editor, status, ...request }) {
	const updatedRequest = await Request.findById(requestId);
	if (!updatedRequest) throw new Error('REQUEST_NOT_FOUND');

	const rawStatus = getRawStatus(updatedRequest.history);
	if (rawStatus.includes('done'))
		throw new Error('REQUEST_FORBIDEN_UPDATE_DONE');
	updatedRequest.history.push({
		status,
		date: new Date().toUTCString()
	});
	if (status === 'accepted' || status === 'rejected' || status === 'outfield') {
		updatedRequest.history.push({
			status: 'done',
			data: new Date().toUTCString()
		});
	}
	const remindCount = getRemindCount(updatedRequest.history);
	if (remindCount >= updatedRequest.remindMax) {
		updatedRequest.history.push(
			{
				status: 'rejected',
				date: new Date().toUTCString()
			},
			{ status: 'done', data: new Date().toUTCString() }
		);
	}
	updatedRequest.remindCount = remindCount;

	const updateReviewer = { ...updatedRequest.reviewer.toObject(), ...reviewer };
	const updateEditor = { ...updatedRequest.editor.toObject(), ...editor };
	const mergedRequest = {
		...updatedRequest.toObject(),
		...request,
		editor: updateEditor,
		reviewer: updateReviewer
	};
	await updatedRequest.updateOne(
		{
			$set: mergedRequest
		},
		{ runValidators: true }
	);
	shouldSendEmail(updatedRequest, mergedRequest);
	return mergedRequest;
}

module.exports = update;
