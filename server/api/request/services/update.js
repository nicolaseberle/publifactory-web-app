const { Request } = require('../model/');

async function update(requestId, request) {
	const updatedRequest = await Request.findOneAndUpdate(
		{ _id: requestId },
		{
			$set: request
		},
		{ runValidators: true, new: true }
	);
	if (!updatedRequest) throw new Error('Request not found.');
	return updatedRequest;
}

module.exports = update;
