const { Request } = require('../model');
const { Billing } = require('../../billing/model');
const error = require('../../../config/error');
const { stripe } = require('../../../../config');
const sendEmailReviewer = require('./send-email-reviewer');
const { chargePlan } = require('../../billing/services');
const getRawStatus = require('./get-raw-status');

async function checkIfBillingNeedUpgrade(billing) {
	if (billing.plan === 'premium') return;
	if (billing.freemiumCount === stripe.maxRequest) {
		throw new error.ApiError('BILLING_NEED_UPGRADE');
	}
}

async function sendInvitation(requestId) {
	const request = await Request.findById(requestId)
		.populate({
			path: 'user',
			select: 'name firstname lastname role roles email'
		})
		.populate({ path: 'journal' });
	if (!request) throw new error.ApiError('REQUEST_NOT_FOUND');
	const requestStatus = getRawStatus(request.history);
	if (requestStatus.includes('sent')) {
		throw new error.ApiError('REQUEST_ALREADY_SENT');
	}
	try {
		const billing = await Billing.findOne({ requests: { $in: [request._id] } });
		await checkIfBillingNeedUpgrade(billing);
		await sendEmailReviewer(requestId);
		request.history.push({
			status: 'sent',
			date: new Date().toUTCString()
		});
		if (
			billing.freemiumCount === stripe.maxRequest &&
			billing.plan === 'premium'
		) {
			await chargePlan(billing);
		} else {
			billing.freemiumCount += 1;
		}
		await billing.save();
		await request.save();
		return request;
	} catch (err) {
		if (err.contructor === error.ApiError && err.message === 'INVALID_EMAIL') {
			request.history.push({
				status: 'bademail',
				data: new Date().toUTCString()
			});
			await request.save();
			return request;
		}
		throw err;
	}
}

module.exports = sendInvitation;
