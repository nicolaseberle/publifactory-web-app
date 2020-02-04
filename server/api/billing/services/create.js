const { Billing } = require('../model');
const Journal = require('../../journal/journal.model');
const User = require('../../user/user.model');
const { ApiError } = require('../../../config/error');

async function create({ billing, userId = undefined, journalId = undefined }) {
	const newBilling = new Billing({
		...billing
	});
	if (journalId) {
		const journal = await Journal.findById(journalId);
		if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
		journal.billing = newBilling;
		await journal.save();
	} else if (userId) {
		const user = await User.findById(userId);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		user.billing = newBilling;
		await user.save();
	} else {
		throw new ApiError('BILLING_FORBIDEN_OPERATION');
	}
	await newBilling.save();
	return newBilling.toObject();
}

module.exports = create;
