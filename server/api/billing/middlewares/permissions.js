const servicePermissions = require('../services/permissions');
const { ApiError } = require('../../../config/error');

/**
 * Inject req.permissions: {read: Boolean, write: Boolean}
 */
async function permissions(req, res, next) {
	try {
		if (req.params.userId) {
			req.permissions = await servicePermissions({
				authId: req.decoded._id,
				userId: req.params.userId
			});
			return next();
		} else if (req.params.journalId) {
			req.permissions = await servicePermissions({
				authId: req.decoded._id,
				journalId: req.params.journalId
			});
			return next();
		}
		return next(new ApiError('BILLING_FORBIDEN_OPERATION'));
	} catch (error) {
		return next(error);
	}
}

module.exports = permissions;
