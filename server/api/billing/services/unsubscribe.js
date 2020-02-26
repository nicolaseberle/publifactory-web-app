const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { unsubscribeSubscriptionPlan, readSubscription } = require('./stripe');
const { stripe } = require('../../../../config');

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
	billing.productStripeId = stripe.freemiumProductId;
	billing.planStripeId = stripe.freemiumPlanId;
	const subscription = await readSubscription(billing.subscriptionFreemiumId);
	billing.subscriptionId = billing.subscriptionFreemiumId;
	billing.subscriptionItemId = subscription.items.data[0].id;
	await billing.save();
	return billing;
}

module.exports = unsubscribe;
