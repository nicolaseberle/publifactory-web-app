const User = require('../../user/user.model');
const Journal = require('../../journal/journal.model');
const serviceRole = require('../../roles/services');
const { ApiError } = require('../../../config/error');

async function userPermissions(userId, authId) {
	const user = await User.findById(userId);
	if (!user) throw new ApiError('USER_NOT_FOUND');
	if (authId !== userId) {
		return { read: false, write: false };
	}
	return { read: true, write: true };
}

async function journalPermissions(journalId, authId) {
	const journal = await Journal.findById(journalId);
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	const userRole = await serviceRole.journalGetRole({
		journalId,
		userId: authId
	});
	if (!userRole) return { read: false, write: false };
	switch (userRole.right) {
		case 'editor':
			return { read: true, write: true };
		case 'associate_editor':
			return { read: true, write: false };
		default:
			return { read: false, write: false };
	}
}

async function permissions({
	authId = undefined,
	journalId = undefined,
	userId = undefined
}) {
	if (userId) return await userPermissions(userId, authId);
	else return await journalPermissions(journalId);
}

module.exports = permissions;
