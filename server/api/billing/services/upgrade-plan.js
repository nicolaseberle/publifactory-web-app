const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const {
	createCustomer,
	attachPaymentMethod,
	createSubscription
} = require('./stripe');
const { stripe } = require('../../../../config');

async function upgradePlan({ billing, billingId }) {
	const updatedBilling = await Billing.findById(billingId);
	if (!updatedBilling) throw new ApiError('BILLING_NOT_FOUND');
	if (updatedBilling.plan === 'premium') {
		throw new ApiError('BILLING_ALREADY_PREMIUM');
	}

	const customer = await createCustomer(updatedBilling);
	billing.customerStripeId = customer.id;
	updatedBilling.plan = 'premium';
	updatedBilling.planStripeId = stripe.premiumPlanId;
	updatedBilling.productStripeId = stripe.premiumProductId;
	updatedBilling.paymentMethodId = billing.paymentMethodId;
	const paymentMethodId = await attachPaymentMethod({
		customerStripeId: updatedBilling.customerStripeId,
		paymentMethodId: billing.paymentMethodId
	});
	updatedBilling.paymentMethodId = paymentMethodId;
	const subscription = await createSubscription(updatedBilling);
	updatedBilling.subscriptionId = subscription.id;
	updatedBilling.subscriptionItemId = subscription.items.data[0].id;

	await updatedBilling.save();
	return {
		...updatedBilling.toObject(),
		subscription: await updatedBilling.subscription
	};
}

module.exports = upgradePlan;
