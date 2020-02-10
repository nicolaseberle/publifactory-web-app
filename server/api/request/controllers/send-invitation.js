const serviceSendInvitation = require('../services/send-invitation');
const { ApiError } = require('../../../config/error');

async function sendInvitation(req, res, next) {
	try {
		if (!req.params.requestId) throw new ApiError('BAD_ROUTE_PARAMETERS');
		const response = await serviceSendInvitation(req.params.requestId);
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		next(error);
	}
}

module.exports = sendInvitation;
