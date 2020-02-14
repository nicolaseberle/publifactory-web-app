const { ApiError } = require('../../../config/error');

async function canRead(req, res, next) {
	if (!req.permissions) return next(new ApiError('INVALID_OPERATION'));
	return req.permissions.read
		? next()
		: next(new ApiError('BILLING_FORBIDEN_READ'));
}

module.exports = canRead;
