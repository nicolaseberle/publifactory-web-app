const { ApiError } = require('../../../config/error');
const Journal = require('../journal.model');

async function read(journalId, filters) {
	const journal = filters.title
		? await Journal.findOne({ title: filters.title }).populate(
				'users content.reference'
		  )
		: await Journal.findById(journalId).populate('users content.reference');
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	return journal;
}

module.exports = read;
