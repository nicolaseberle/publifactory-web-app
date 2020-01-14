const Journal = require('../../journal/journal.model');
const { ApiError } = require('../../../config/error');

async function getPreprintCollection(populate = false) {
	const preprintCollection = await Journal.findOne({
		title: 'Preprint Collection'
	});
	if (populate)
		await preprintCollection.populate('content.reference').execPopulate();
	if (!preprintCollection) throw new ApiError('NO_PREPRINT_COLLECTION');
	return preprintCollection;
}

module.exports = getPreprintCollection;
