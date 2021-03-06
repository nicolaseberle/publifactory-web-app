const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');
const { updateCustomer } = require('./stripe');

async function update({ billingId, billing }) {
	const updatedBilling = await Billing.findById(billingId);
	if (!updatedBilling) throw new ApiError('BILLING_NOT_FOUND');
	if (billing.email || billing.fullName || billing.paymentMethodId) {
		await updateCustomer(updatedBilling.customerStripeId, billing);
	}
	const merged = { ...updatedBilling.toObject(), ...billing };
	await updatedBilling.updateOne({ $set: merged }, { runValidators: true });
	await updatedBilling.save();

	return updatedBilling;
}

module.exports = update;
