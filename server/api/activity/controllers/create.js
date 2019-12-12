const serviceCreate = require('../services/create');
const { enumStatus } = require('../model');

async function create(req, res, next) {
	try {
		if (!req.body.fields && !req.body.title)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await serviceCreate(req.body.title,req.body.fields);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = create;
