const serviceCreate = require('../services/create');

async function create(req, res, next) {
	try {
		if (
			!req.body.reviewer ||
			!req.body.editor ||
			!req.body.object ||
			!req.body.content
		)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceCreate(req.body);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = create;
