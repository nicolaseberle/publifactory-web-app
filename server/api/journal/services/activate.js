const { ApiError } = require('../../../config/error');
const JournalRole = require('../../roles/journal/roles.journal.model');
const User = require('../../user/user.model');
const read = require('./read');

async function activate(journalId, userId) {
	const journal = await read(journalId);
	journal.users = [];
	const user = await User.findById(userId);
	if (!user) throw new ApiError('USER_NOT_FOUND');
	new JournalRole({
		id_user: user._id, // eslint-disable-line
		id_journal: journal._id, // eslint-disable-line
		right: 'editor'
	}).save();
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	return journal;
}

module.exports = activate;
