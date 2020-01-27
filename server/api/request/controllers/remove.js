const serviceRemove = require("../services/remove");

async function remove(req, res, next) {
	try {
		if (!req.params.requestId)
			throw { code: 422, message: "Missing parameters." };
		const response = await serviceRemove({
			requestId: req.params.requestId,
			remove: req.body.remove
		});
		res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = remove;
