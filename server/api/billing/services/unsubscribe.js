const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { unsubscribeSubscriptionPlan } = require('./stripe');

async function unsubscribe({ billingId }) {
	const billing = await Billing.findById(billingId);
	if (!billing) throw new ApiError('BILLING_NOT_FOUND');
	const subscription = await unsubscribeSubscriptionPlan({
		subscriptionId: billing.subscriptionId
	});
	billing.plan = 'freemium';
	billing.canceledFrom = 'user';
	billing.canceled = true;
	billing.canceledOnce = true;
	await billing.save();
	return subscription;
}

module.exports = unsubscribe;
