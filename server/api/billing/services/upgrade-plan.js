const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { attachPayementMethod, upgradeSubscriptionPlan } = require('./stripe');
const { stripe } = require('../../../../config');

async function upgradePlan({ billing, billingId }) {
	const updatedBilling = await Billing.findById(billingId);
	if (!updatedBilling) throw new ApiError('BILLING_NOT_FOUND');
	if (updatedBilling.plan === 'premium') {
		throw new ApiError('BILLING_ALREADY_PREMIUM');
	}

	if (updatedBilling.plan === 'premium') {
		updatedBilling.planStripeId = stripe.premiumPlanId;
	}
	updatedBilling.plan = 'premium';
	updatedBilling.planStripeId = stripe.premiumPlanId;
	updatedBilling.payementMethodId = billing.payementMethodId;
	const paymentMethodId = await attachPayementMethod({
		customerStripeId: updatedBilling.customerStripeId,
		payementMethodId: billing.payementMethodId
	});
	updatedBilling.payementMethodId = paymentMethodId;
	const subscription = await upgradeSubscriptionPlan({
		subscriptionId: updatedBilling.subscriptionId,
		payementMethodId: updatedBilling.payementMethodId,
		premiumPlanId: updatedBilling.premiumPlanId
	});
	updatedBilling.subscriptionId = subscription.id;
	updatedBilling.subscriptionItemId = subscription.items.data[0].id;

	await updatedBilling.save();
	return {
		...updatedBilling.toObject(),
		subscription: await updatedBilling.subscription
	};
}

module.exports = upgradePlan;
