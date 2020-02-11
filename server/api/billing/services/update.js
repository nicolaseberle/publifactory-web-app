const { Billing } = require('../model');
const { ApiError } = require('../../../config/error');

async function update({
	billingId,
	userId = undefined,
	journalId = undefined,
	billing
}) {
	throw new ApiError('NOT_IMPLEMENTED');
}

module.exports = update;
