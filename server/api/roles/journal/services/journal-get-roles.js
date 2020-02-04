const RolesJournal = require('../roles.journal.model');

async function journalGetRoles({
	journalId = undefined,
	right = undefined,
	userId = undefined
}) {
	let query = {};
	if (journalId) query.id_journal = journalId;
	if (right) query.right = right;
	if (userId) query.id_user = userId;
	const journalRoles = await RolesJournal.find(query);
	if (!journalRoles) throw new Error('JOURNAL_ROLE_NOT_FOUND');
	return journalRoles;
}

module.exports = journalGetRoles;
