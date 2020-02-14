const serviceUpdate = require('../services/update');

async function update(req, res, next) {
	try {
		const response = await serviceUpdate({
			billingId: req.params.billingId,
			userId: req.params.userId,
			journalId: req.params.journalId,
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
