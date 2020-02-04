const RolesJournal = require('../roles.journal.model');

async function journalGetRole({
	journalId = undefined,
	right = undefined,
	userId = undefined
}) {
	const query = {};
	if (journalId) query.id_journal = journalId;
	if (right) query.right = right;
	if (userId) query.id_user = userId;
	console.log(query);
	const journalRole = await RolesJournal.findOne(query);
	return journalRole;
}

module.exports = journalGetRole;
