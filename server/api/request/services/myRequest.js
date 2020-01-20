const { Request } = require('../model');
const User = require('../../user/user.model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function myRequest(userId,{ page = 1, count = 5, filters }) {
	const response = { page, count };
	const author = await User.findById(userId).exec();

	let pipeline = [];
	const sort = { $sort: { deadline: -1 } };
	pipeline.push(sort);
	if (filters.title) {
		pipeline.push({
			$match: { title: { $regex: `^${filters.title}`, $options: 'i' } }
		});
	}
	pipeline.push({
		$match: { 'editor.email': author.email }
	});
	if (filters.status) {
		pipeline.push({
			$match: { 'history.status': { $in: [filters.status] } }
		});
	}

	pipeline.push(...paginate(page, count));
	const list = await Request.aggregate(pipeline);
	return { ...response, data: list };
}

module.exports = myRequest;
