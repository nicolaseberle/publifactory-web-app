const { InvitationReviewer } = require('../model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({ page = 1, count = 5, filters }) {
	const response = { page, count };
	let pipeline = [];
	const sort = { $sort: { deadline: -1 } };
	const lookup = {
		$lookup: {
			from: 'requests',
			localField: 'requests',
			foreignField: '_id',
			as: 'requests'
		}
	};
	pipeline.push(sort, lookup);
	if (filters.title) {
		pipeline.push({ $match: { title: { $regex: `^${filters.title}` } } });
	}

	pipeline.push(...paginate(page, count));
	console.log(pipeline);
	const list = await InvitationReviewer.aggregate(pipeline);

	return { ...response, data: list };
}

module.exports = list;
