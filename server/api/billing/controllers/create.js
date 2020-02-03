const serviceCreate = require('../services/create');

async function create(req, res, next) {
	try {
		if (
			req.path.includes('billings/users/') ||
			req.path.includes('billings/journals/')
		)
			throw { code: 400, message: 'route require path users or journals.' };

		const response = await serviceCreate({
			userId: req.params.userId,
			journalId: req.params.journalId
		});
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = create;
