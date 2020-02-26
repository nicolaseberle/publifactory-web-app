const { ApiError } = require('../../../config/error');
const Journal = require('../journal.model');

async function read(journalId) {
	const journal = await Journal.findById(journalId).populate(
		'users content.reference'
	);
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	return journal;
}

module.exports = read;
