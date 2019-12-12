const { Request } = require('../model');

function paginate(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

async function list({ page = 1, count = 5, filters }) {
	const response = { page, count };
	let pipeline = [];
	const sort = { $sort: { creationDate: -1 } };
	pipeline.push(sort);
	if (filters.title) {
		pipeline.push({
			$match: { title: { $regex: `^${filters.title}`, $options: 'i' } }
		});
	}
	pipeline.push({
    $group: {
        _id: {
          $add: [
           { $dayOfYear: "$creationDate"},
           { $multiply:
             [400, {$year: "$creationDate"}]
           }
        ]},
        click: { $sum: 1 },
        first: {$min: "$creationDate"}
      }
	});

	pipeline.push(...paginate(page, count));
	const list = await Request.aggregate(pipeline);
	return { ...response, data: list };
}

module.exports = list;
