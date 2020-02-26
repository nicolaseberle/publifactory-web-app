const User = require("../../user/user.model");
const Journal = require("../../journal/journal.model");
const { Billing } = require("../../billing/model");
const { ApiError } = require("../../../config/error");
const serviceRole = require("../../roles/services");
const { Request } = require("../model");

async function isRequestFromJournal(req, billing) {
	const journal = await Journal.findOne({ billing: billing._id });
	if (!journal) return false;
	req.journal = journal;
	return !!journal.billing;
}

function isRequestFromUser(billing, user) {
	return user.billing
		? user.billing.toString() === billing._id.toString()
		: false;
}

function userPermissions(authId, request) {
	if (request.user.toString() === authId) return { write: true, read: true };
	return { write: false, read: false };
}

async function journalPermissions(journalId, authId) {
	const userRole = await serviceRole.journalGetRole({
		journalId,
		userId: authId
	});
	if (
		!userRole ||
		userRole.right !== "editor" ||
		userRole.right !== "associate_editor"
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
		if (!request) throw new ApiError("REQUEST_NOT_FOUND");
		const user = await User.findById(req.decoded._id).populate();
		if (!user) throw new ApiError("USER_NOT_FOUND");
		const billing = await Billing.findOne({
			requests: { $in: [req.params.requestId] }
		});
		req.billing = billing;
		// bypass if admin:
		const isAdmin = user.roles.find(role => role === "admin");
		if (isAdmin) {
			req.permissions = { read: true, write: true };
			return next();
		}
		if (!billing) throw new ApiError("BILLING_NOT_FOUND");
		if (isRequestFromUser(billing, user)) {
			if (isAdmin) return next();
			else {
				req.permissions = userPermissions(req.decoded._id, request);
				return next();
			}
		} else if (await isRequestFromJournal(req, billing)) {
			if (isAdmin) return next();
			else {
				req.permissions = await journalPermissions(
					req.journal._id.toString(),
					req.decoded._id
				);
			}
		}
		req.permissions = { read: false, write: false };
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = permissions;
