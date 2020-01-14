const serviceAnswerSubmission = require('../services/answer-submission');
const { ApiError } = require('../../../config/error');

async function answerSubmission(req, res, next) {
	try {
		if (!req.params.articleId || !req.params.journalId || !req.params.answer) {
			throw new ApiError('BAD_PARAMETERS');
		}
		const response = await serviceAnswerSubmission({
			userId: req.decoded._id,
			articleId: req.params.articleId,
			journalId: req.params.journalId,
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

module.exports = answerSubmission;
