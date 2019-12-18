const { Request } = require('../model');

async function totalRequest() {
	let pipeline = [];
	const list = await Request.find({});
	console.log(list)
	return { data: list.length };
}

module.exports = totalRequest;
