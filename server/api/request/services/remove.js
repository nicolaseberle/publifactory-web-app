const { Request } = require('../model');

async function remove(requestId) {
	const deleted = await Request.findOneAndDelete({ _id: requestId });
	if (!deleted) throw new Error('Request not found.');
	return deleted;
}

module.exports = remove;
