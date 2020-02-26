const { ApiError } = require('../../../config/error');
const read = require('../services/read');

async function requireActivation(req, res, next) {
	try {
		const journalId = req.params.id ? req.params.id : req.params.journalId;
		const journal = read(journalId);
		if (!journal.activate) {
			return next(new ApiError('JOURNAL_REQUIRE_ACTIVATION'));
		}
		return next();
	} catch (error) {
		return next(error);
	}
}

module.exports = requireActivation;
