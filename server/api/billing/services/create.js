const { Billing } = require('../model');
const Journal = require('../../journal/journal.model');
const User = require('../../user/user.model');
const { ApiError } = require('../../../config/error');
const { createCustomer, createSubscription } = require('./stripe');

async function createBilling(billing) {
	const customer = await createCustomer(billing);
	billing.customerStripeId = customer.id;
	const subscription = await createSubscription(billing);
	billing.subscriptionId = subscription.id;
	billing.subscriptionFreemiumId = subscription.id;
	billing.subscriptionItemId = subscription.items.data[0].id;
	await billing.save();
}

async function create({ billing, userId = undefined, journalId = undefined }) {
	const newBilling = new Billing({
		...billing
	});
	if (journalId) {
		const journal = await Journal.findById(journalId);
		if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
		if (journal.billing) throw new ApiError('BILLING_ALREADY_EXIST');
		journal.billing = newBilling._id;
		await createBilling(newBilling);
		await journal.save();
	} else if (userId) {
		const user = await User.findById(userId);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		if (user.billing) throw new ApiError('BILLING_ALREADY_EXIST');
		user.billing = newBilling._id;
		await createBilling(newBilling);
		await user.save();
	} else {
		throw new ApiError('BILLING_FORBIDEN_OPERATION');
	}

	return {
		...newBilling.toObject(),
		subscription: await newBilling.subscription
	};
}

module.exports = create;
