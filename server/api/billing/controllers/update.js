const serviceUpdate = require('../services/update');
const { ApiError } = require('../../../config/error');

async function update(req, res, next) {
	try {
		if (
			req.body.subscriptionId ||
			req.body.subscriptionItemId ||
			req.body.productStripeId ||
			req.body.planStripeId ||
			req.body.plan ||
			req.body.requests
		)
			throw new ApiError('BAD_PARAMETERS');
		const response = await serviceUpdate({
			billingId: req.params.billingId,
			billing: req.body
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = update;
