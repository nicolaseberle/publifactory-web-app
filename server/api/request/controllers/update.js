const serviceUpdate = require('../services/update');
const { enumStatus } = require('../model');

async function update(req, res, next) {
	try {
		if (!req.params.requestId || !req.body.reviewer || !req.body.status)
			throw { code: 422, message: 'Missing parameters.' };
		if (!enumStatus.includes(req.body.status))
			throw { code: 400, message: 'Bad parameters.' };
		const response = await serviceUpdate(req.params.requestId, req.body);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log('ERROR=>', error);
		next(error);
	}
}

module.exports = update;
