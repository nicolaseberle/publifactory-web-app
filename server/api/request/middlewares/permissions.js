const User = require('../../user/user.model');
const Journal = require('../../journal/journal.model');
const { Billing } = require('../../billing/model');
const { ApiError } = require('../../../config/error');
const serviceRole = require('../../roles/services');
const { Request } = require('../model');

async function isRequestFromJournal(req, billing) {
	const journal = await Journal.findOne({ billing: billing._id });
	if (!journal) return false;
	req.journal = journal;
	return !!journal.billing;
}

function isRequestFromUser(billing, user) {
	console.log(
		'ISREQFROMUSEr====>',
		billing._id,
		user.billing,
		user.billing.toString() === billing._id.toString()
	);
	return user.billing
		? user.billing.toString() === billing._id.toString()
		: false;
}

function userPermissions(userId, authId) {
	if (userId === authId) {
		return { read: true, write: true };
	} else return { read: false, write: false };
}

async function journalPermissions(journalId, authId) {
	const userRole = await serviceRole.journalGetRole({
		journalId,
		userId: authId
	});
	if (
		!userRole ||
		userRole.right !== 'editor' ||
		userRole.right !== 'associate_editor'
	) {
		return { read: false, write: false };
	}
	return { read: true, write: true };
}

/**
 * This will inject req.journal? || req.user and billing
 *
 */
async function permissions(req, res, next) {
	try {
		const request = await Request.findById(req.params.requestId);
		if (!request) throw new ApiError('REQUEST_NOT_FOUND');
		const user = await User.findById(req.decoded._id);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		// bypass if admin:
		console.log('user=>', user);
		const isAdmin = user.roles.find(role => role === 'admin');
		if (isAdmin) req.permissions = { read: true, write: true };
		const billing = await Billing.findOne({
			requests: { $in: [req.params.requestId] }
		});
		req.billing = billing;
		req.user = user;
		if (!billing) throw new ApiError('BILLING_NOT_FOUND');
		console.log('MIDDDLEWARE PERM====================');
		if (isRequestFromUser(billing, user)) {
			console.log('REQUEST FROM USER');
			if (isAdmin) return next();
			else {
				req.permissions = userPermissions(user._id.toString(), req.decoded._id);
				console.log('PERM USER=>', req.permissions);
				return next();
			}
		} else if (await isRequestFromJournal(req, billing)) {
			console.log('REQUEST FROM JOURNAL');
			if (isAdmin) return next();
			else {
				req.permissions = await journalPermissions(
					req.journal._id.toString(),
					req.decoded._id
				);
			}
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = permissions;
