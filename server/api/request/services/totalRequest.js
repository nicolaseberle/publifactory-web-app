const { Request } = require('../model');

async function totalRequest() {
	let pipeline = [];
	const list = await Request.find({});
	return { data: list.length };
}

module.exports = totalRequest;
