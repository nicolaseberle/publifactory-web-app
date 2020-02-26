const serviceCreate = require('../services/create');
const { ApiError } = require('../../../config/error');

async function create(req, res, next) {
	try {
		const { title, abstract, tags, ...body } = req.body;
		if (Object.keys(body).length) {
			return next(new ApiError('BAD_PARAMETERS'));
		}
		const response = await serviceCreate({
			userId: req.decoded._id,
			journal: { title, abstract, tags }
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
