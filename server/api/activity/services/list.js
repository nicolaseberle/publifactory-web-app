const { Request } = require('../model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({ page = 1, count = 5, filters }) {
	const response = { page, count };
	let pipeline = [];
	const sort = { $sort: { deadline: -1 } };
	pipeline.push(sort);
	if (filters.title) {
		pipeline.push({
			$match: { title: { $regex: `^${filters.title}`, $options: 'i' } }
		});
	}
	/*
	if (filters.status) {
		pipeline.push({
			$match: { 'history.status': { $in: [filters.status] } }
		});
	}*/

	pipeline.push(...paginate(page, count));
	const list = await Request.aggregate(pipeline);
	return { ...response, data: list };
}

module.exports = list;
