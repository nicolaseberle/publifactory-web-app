const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { unsubscribeSubscriptionPlan } = require('./stripe');

async function unsubscribe({ billingId }) {
	const billing = await Billing.findById(billingId);
	if (!billing) throw new ApiError('BILLING_NOT_FOUND');
	if (billing.plan !== 'premium') {
		throw new ApiError('BILLING_FORBIDEN_OPERATION');
	}
	await unsubscribeSubscriptionPlan({
		subscriptionId: billing.subscriptionId
	});
	billing.plan = 'freemium';
	billing.productStripeId = null;
	billing.planStripeId = null;
	billing.subscriptionId = null;
	billing.subscriptionItemId = null;
	await billing.save();
	return billing;
}

module.exports = unsubscribe;
