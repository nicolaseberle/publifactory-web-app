function pagination(page = 1, count = 5) {
	const skip = { $skip: (page - 1) * count };
	const limit = { $limit: count };
	return [skip, limit];
}

module.exports = pagination;
