const serviceInviteAuthorToSubmit = require('../services/invite-author-to-submit');
const { ApiError } = require('../../../config/error');

async function inviteAuthorToSubmit(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.journalId) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceInviteAuthorToSubmit({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			journalId: req.params.journalId
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		console.log(error);
		return next(error);
	}
}

module.exports = inviteAuthorToSubmit;
