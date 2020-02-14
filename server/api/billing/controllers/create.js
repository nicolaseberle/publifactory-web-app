const serviceCreate = require('../services/create');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		if (req.body.plan === 'premium' && !req.body.payementMethodId) {
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
