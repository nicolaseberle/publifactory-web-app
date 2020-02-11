const serviceUpgradePlan = require('../services/upgrade-plan');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		if (!req.body.payementMethodId) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceUpgradePlan({
			userId: req.params.userId,
			journalId: req.params.journalId,
			billingId: req.params.billingId,
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
