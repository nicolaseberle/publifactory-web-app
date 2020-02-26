const serviceCreate = require('../services/create');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		if (
			req.body.paymentMethodId ||
			req.body.subscriptionId ||
			req.body.subscriptionItemId ||
			req.body.productStripeId ||
			req.body.planStripeId ||
			req.body.plan ||
			req.body.requests
		) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceCreate({
			userId: req.params.userId,
			journalId: req.params.journalId,
			billing: req.body
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = create;
