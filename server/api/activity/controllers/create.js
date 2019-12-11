const updateActivity = require('../services/create');
const { enumStatus } = require('../model');

async function create(req, res, next) {
	try {
		console.log(req.body.fields,req.body.title)
		if (!req.body.fields && !req.body.title)
			throw { code: 422, message: 'Missing parameters.' };
		const response = await updateActivity(req.body.fields,req.body.title);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = create;
