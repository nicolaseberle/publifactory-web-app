const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');

async function read({ billingId }) {
	const billing = await Billing.findById(billingId);
	if (!billing) throw new ApiError('BILLING_NOT_FOUND');
	return billing;
}

module.exports = read;
