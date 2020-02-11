const { Request } = require('../model');
const { Billing } = require('../../billing/model');
const error = require('../../../config/error');
const sendEmailReviewer = require('./send-email-reviewer');
const {
	chargePlan,
	readSubscription,
	readNextInvoice
} = require('../../billing/services');
const getRawStatus = require('./get-raw-status');

async function checkIfBillingNeedUpgrade(billing) {
	const nextInvoice = await readNextInvoice({
		customerStripeId: billing.customerStripeId,
		subscriptionId: billing.subscriptionId
	});
	const subscription = await readSubscription(billing.subscriptionId);
	// Check if freemium will exced
	const max = subscription.items.data[0].plan.tiers[0].up_to;
	if (
		nextInvoice.amount_due / 100 + 1 >= max &&
		!nextInvoice.default_payment_method.invoice_settings.default_payment_method
	) {
		throw new error.ApiError('BILLING_NEED_UPGRADE');
	}
}

async function sendInvitation(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new error.ApiError('REQUEST_NOT_FOUND');
	const requestStatus = getRawStatus(request.history);
	if (requestStatus.includes('sent')) {
		throw new error.ApiError('REQUEST_ALREADY_SENT');
	}
	try {
		await sendEmailReviewer(requestId);
		request.history.push({
			status: 'sent',
			date: new Date().toUTCString()
		});
		const billing = await Billing.findOne({ requests: { $in: [request._id] } });
		if (billing.plan === 'freemium') {
			await checkIfBillingNeedUpgrade(billing);
		}
		await chargePlan(billing);
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
