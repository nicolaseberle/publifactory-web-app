const serviceInviteReviewer = require('../services/invite-reviewer');
const { ApiError } = require('../../../config/error');

async function inviteReviewer(req, res, next) {
	try {
		if (!req.params.articleId) throw new ApiError('BAD_PARAMETERS');
		const response = serviceInviteReviewer({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			email: req.body.email
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = inviteReviewer;
