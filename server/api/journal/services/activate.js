const { ApiError } = require('../../../config/error');
const JournalRole = require('../../roles/journal/roles.journal.model');
const User = require('../../user/user.model');
const read = require('./read');
const Email = require('../../email/email.controller');
const { activateOrphanRequest } = require('../../request/services');

async function activate({ journalId, userId }) {
	const journal = await read(journalId);
	if (journal.activate) throw new ApiError('JOURNAL_ALREADY_ACTIVATE');
	const user = await User.findById(userId);
	journal.users = [user._id];
	journal.activate = true;
	if (!user) throw new ApiError('USER_NOT_FOUND');
	new JournalRole({
		id_user: user._id, // eslint-disable-line
		id_journal: journal._id, // eslint-disable-line
		right: 'editor'
	}).save();

	new Email(user.email).sendEmail({
		subject: ``,
		html: ''
	});
	await journal.save();
	await activateOrphanRequest(journal._id);
	return journal;
}

module.exports = activate;
