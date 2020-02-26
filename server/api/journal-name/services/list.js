const JournalName = require('../model');

async function list({ count = 20, ...filters }) {
	const pipeline = [];
	const match = {
		$match: {
			title: { $regex: `^${filters.title}`, $options: 'i' }
		}
	};
	const limit = {
		$limit: count
	};
	pipeline.push(match, limit);
	const list = await JournalName.aggregate(pipeline);
	return list;
}

module.exports = list;
