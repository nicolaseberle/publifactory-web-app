const { Request } = require('../model');
const { Billing } = require('../../billing/model');
const { ApiError } = require('../../../config/error');
const sendEmailReviewer = require('./send-email-reviewer');
const { chargePlan } = require('../../billing/services');
const getRawStatus = require('./get-raw-status');

async function sendInvitation(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new ApiError('REQUEST_NOT_FOUND');
	const requestStatus = getRawStatus(request.history);
	if (requestStatus.includes('sent')) throw new Error('REQUEST_ALREADY_SENT');
	try {
		await sendEmailReviewer(requestId);
		request.history.push({
			status: 'sent',
			date: new Date().toUTCString()
		});
		const billing = await Billing.findOne({ requests: { $in: [request._id] } });
		await chargePlan(billing);
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

module.exports = sendInvitation;
