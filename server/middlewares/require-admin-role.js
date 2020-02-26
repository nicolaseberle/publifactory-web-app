const { ApiError } = require('../config/error');
const User = require('../api/user/user.model');

async function requireActivation(req, res, next) {
	try {
		const user = await User.findById(req.decoded._id);
		req.isAdmin = user.role === 'admin';
		if (!req.isAdmin) {
			throw new ApiError('ROLE_REQUIRE_ADMIN');
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = requireActivation;
