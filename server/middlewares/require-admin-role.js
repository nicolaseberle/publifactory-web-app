const { ApiError } = require('../config/error');

async function requireActivation(req, res, next) {
	try {
		req.isAdmin = req.decoded.role === 'admin';
		if (req.isAdmin !== 'admin') {
			throw new ApiError('ROLE_REQUIRE_ADMIN');
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = requireActivation;
