const { Request } = require('../model');
const User = require('../../user/user.model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({ page = 1, count = 5, filters, userId = undefined }) {
	const response = { page, count };
	const pipeline = [];
	const sort = { $sort: { createdAt: -1 } };
	pipeline.push(sort);
	if (filters.title) {
		pipeline.push({
			$match: { title: { $regex: `^${filters.title}`, $options: 'i' } }
		});
	}
	if (filters.status) {
		pipeline.push({
			$match: { 'history.status': { $in: [filters.status] } }
		});
	}
	if (filters.email) {
		pipeline.push({
			$match: { 'editor.email': filters.email }
		});
	}
	if (filters.userId) {
		const user = await User.findById(userId).exec();
		pipeline.push({
			$match: { 'editor.email': user.email }
		});
	}

	pipeline.push(...paginate(page, count));
	const list = await Request.aggregate(pipeline);
	return { ...response, data: list };
}

module.exports = list;
