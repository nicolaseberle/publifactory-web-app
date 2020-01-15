const serviceAnswer = require('../services/answer');
const { ApiError } = require('../../../config/error');

async function answer(req, res, next) {
	try {
		const response = await serviceAnswer();
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = answer;
