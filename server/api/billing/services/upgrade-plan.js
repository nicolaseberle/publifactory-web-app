// const updateReviewer = { ...updatedRequest.reviewer.toObject(), ...reviewer };
// const updateEditor = { ...updatedRequest.editor.toObject(), ...editor };
// const mergedRequest = {
//   ...updatedRequest.toObject(),
//   ...request,
//   editor: updateEditor,
//   reviewer: updateReviewer
// };
// await updatedRequest.updateOne(
//   { $set: mergedRequest },
//   { runValidators: true }
// );

const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { updateCustomer, upgradePlan: stripeUpgradePlan } = require('./stripe');
const { stripe } = require('../../../../config');

async function upgradePlan({ billing, billingId }) {
	const updatedBilling = await Billing.findById(billingId);
	if (!updatedBilling) throw new ApiError('BILLING_NOT_FOUND');
	if (updatedBilling.plan === 'premium') {
		throw new ApiError('BILLING_FORBIDEN_OPERATION');
	}

	if (updatedBilling.plan === 'premium') {
		updatedBilling.planStripeId = stripe.premiumPlanId;
	}
	await updatedBilling.updateOne({ $set: billing }, { runValidators: true });

	console.log('diff=>', updatedBilling.payementMethodId);
	await updateCustomer(updatedBilling.customerStripeId, {
		payment_method: updatedBilling.payementMethodId // eslint-disable-line
	});
	const subscription = await stripeUpgradePlan({
		subscriptionId: billing.subscriptionId,
		payementMethodId: billing.payementMethodId,
		premiumPlanId: stripe.premiumPlanId
	});
	updatedBilling.subscriptionId = subscription.id;
	updatedBilling.subscriptionItemId = subscription.items.data[0].id;
	return {
		...updatedBilling.toObject(),
		subscription: await updatedBilling.subscription
	};
}

module.exports = upgradePlan;
