const serviceRemind = require("../services/remind");

async function remind(req, res, next) {
	try {
		if (!req.params.requestId)
			throw { code: 422, message: "Missing parameters." };
		const response = await serviceRemind(req.params.requestId);
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = remind;
