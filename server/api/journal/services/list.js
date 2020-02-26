const Journal = require('../journal.model');

async function list({ page = 1, count = 20, deleted = false, ...filters }) {
	const pipeline = [];

	pipeline.push({
		$match: { deleted: deleted }
	});
	if (filters.activate) {
		pipeline.push({
			$match: { activate: filters.activate }
		});
	}

	const journals = await Journal.populate(await Journal.aggregate(pipeline), [
		{
			path: 'users content.reference'
		}
	]);
	return { journals };
}

module.exports = list;
