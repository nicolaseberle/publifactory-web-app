const { Request } = require('../model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({ page = 1, count = 5, filters }) {
	const response = { page, count };
	let pipeline = [];

	if (filters.title) {
		pipeline.push({
			$match: { title: { $regex: `^${filters.title}`, $options: 'i' } }
		});
	}
	pipeline.push({
    $group: {
        _id: {
					month: { $month: "$creationDate" },
        	day: { $dayOfMonth: "$creationDate" },
        	year: { $year: "$creationDate" }
				},
        click: { $sum: 1 },
        date: { $min: "$creationDate" }
      }
	})
	const sort = { $sort: { date: 1 } };
	pipeline.push(sort);

	//pipeline.push(...paginate(page, count));
	const list = await Request.aggregate(pipeline);
	return { ...response, data: list };
}

module.exports = list;
