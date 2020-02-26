const { ApiError } = require('../../../config/error');

async function canWrite(req, res, next) {
	if (!req.permissions) return next(new ApiError('INVALID_OPERATION'));
	return req.permissions.write
		? next()
		: next(new ApiError('BILLING_FORBIDEN_WRITE'));
}

module.exports = canWrite;
