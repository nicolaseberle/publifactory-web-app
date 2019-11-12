const { Request } = require('../model');

async function remove(requestId) {
	const deleted = await Request.findOneAndDelete({ _id: requestId });
	if (!deleted) throw new Error('REQUEST_NOT_FOUND');
	return deleted;
}

module.exports = remove;
