const { Billing } = require('../model');
const Journal = require('../../journal/journal.model');
const User = require('../../user/user.model');
const { ApiError } = require('../../../config/error');

async function remove({ billingId }) {
	const deleted = Billing.findOneAndDelete({ _id: billingId });
	if (!deleted) throw new ApiError('BILLING_NOT_FOUND');
	return deleted;
}

module.exports = remove;
