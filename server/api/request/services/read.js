const { Request } = require('../model');

async function read(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('Request not found.');
	return request;
}

module.exports = read;
