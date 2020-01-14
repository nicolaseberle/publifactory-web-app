const Article = require('../../article/article.model');
const serviceRole = require('../../roles/services');
const { ApiError } = require('../../../config/error');

async function answerReviewInvitation({ userId, articleId, answer }) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (answer === 'accept') {
		const userRole = await serviceRole.articleGetRole({
			articleId,
			right: 'reviewer',
			userId
		});
		article.reviewers.push(userId);
		// Might check for userRole if he is 'author' or 'AE/editor' of this article
		if (userRole) throw new ApiError('ROLE_ALREADY_CREATED');
		await serviceRole.articleAddRole(userId, articleId, 'reviewer');
		await article.save();
	}
	return article;
}

module.exports = answerReviewInvitation;
