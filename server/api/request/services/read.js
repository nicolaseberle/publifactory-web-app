const { Request } = require('../model');

async function read(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error('REQUEST_NOT_FOUND');
	return request;
}

module.exports = read;
