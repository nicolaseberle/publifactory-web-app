const serviceAnswerReviewInvitation = require('../services/answer-review-invitation');
const { ApiError } = require('../../../config/error');

async function answerReviewInvitation(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.answer) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceAnswerReviewInvitation({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			answer: req.params.answer
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = answerReviewInvitation;
