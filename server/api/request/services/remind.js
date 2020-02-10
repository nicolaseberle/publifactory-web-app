const { Request } = require('../model');
const sendEmailReviewer = require('./send-email-reviewer');
const { ApiError } = require('../../../config/error');

async function remind(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new ApiError('REQUEST_NOT_FOUND');
	request.remindCount += 1;
	try {
		await sendEmailReviewer(requestId);
		request.history.push({
			status: 'remind',
			date: new Date().toUTCString()
		});
		await request.save();
		return request;
	} catch (error) {
		request.history.push({
			status: 'bademail',
			data: new Date().toUTCString()
		});
		await request.save();
		return request;
	}
}

module.exports = remind;
