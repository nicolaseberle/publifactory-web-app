const { Billing } = require('../model');
const Journal = require('../../journal/journal.model');
const User = require('../../user/user.model');
const { ApiError } = require('../../../config/error');
const { createCustomer, createSubscription } = require('./stripe');
const { stripe } = require('../../../../config');

async function create({ billing, userId = undefined, journalId = undefined }) {
	const newBilling = new Billing({
		...billing
	});
	if (journalId) {
		const journal = await Journal.findById(journalId);
		if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
		journal.billing = newBilling._id;
		await journal.save();
	} else if (userId) {
		const user = await User.findById(userId);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		user.billing = newBilling._id;
		await user.save();
	} else {
		throw new ApiError('BILLING_FORBIDEN_OPERATION');
	}

	if (newBilling.plan === 'premium')
		newBilling.planStripeId = stripe.premiumPlanId;
	const customer = await createCustomer(newBilling);
	newBilling.customerStripeId = customer.id;
	const subscription = await createSubscription(newBilling);
	newBilling.subscriptionId = subscription.id;
	newBilling.subscriptionItemId = subscription.items.data[0].id;
	await newBilling.save();
	return {
		...newBilling.toObject(),
		subscription: await newBilling.subscription
	};
}

module.exports = create;
