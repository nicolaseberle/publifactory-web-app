const mongoose = require('mongoose');
const { Request } = require('../model');
const User = require('../../user/user.model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({
	page = 1,
	count = 5,
	filters = undefined,
	userId = undefined
}) {
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
		const user = User.findOne({ email: filters.email });

		pipeline.push({
			$match: {
				user: { $eq: user._id }
			}
		});
	}
	if (userId) {
		const matchUser = {
			$match: {
				user: { $eq: new mongoose.Types.ObjectId(userId) }
			}
		};
		pipeline.push(matchUser);
	}
	pipeline.push(...paginate(page, count));

	const list = await Request.populate(await Request.aggregate(pipeline), [
		{
			path: 'user',
			select: 'name firstname lastname role roles email'
		},
		{
			path: 'journal'
		}
	]);

	return { ...response, data: list };
}

module.exports = list;
