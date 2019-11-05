const { Request } = require('../model/');

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

async function update(requestId, { reviewer, editor, status, ...request }) {
	const updatedRequest = await Request.findById(requestId);
	if (!updatedRequest) throw new Error('Request not found.');

	const rawStatus = getRawStatus(updatedRequest.history);
	if (rawStatus.includes('done'))
		throw new Error("Can't update a finished request");
	updatedRequest.history.push({
		status,
		date: new Date().toUTCString()
	});
	const remindCount = getRemindCount(updatedRequest.history);
	if (remindCount >= updatedRequest.remindMax) {
		updatedRequest.history.push({
			status: 'done',
			date: new Date().toUTCString()
		});
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
	return mergedRequest;
}

module.exports = update;
