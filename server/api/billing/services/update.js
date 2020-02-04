const { Billing } = require('../model');

async function update({
	billingId,
	userId = undefined,
	journalId = undefined,
	billing
}) {
	const updateBilling = await Billing.findById(billingId);

	return updateBilling;
}

module.exports = update;
