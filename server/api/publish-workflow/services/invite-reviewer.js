const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');
const serviceRole = require('../../roles/services');
const { emailInviteReviewer } = require('../../../config/emailing');
const Email = require('../../email/email.controller');

async function inviteReviewer({ userId, articleId, email }) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	const userRole = await serviceRole.articleGetRole({ articleId, userId });
	const serviceMail = new Email(email);
	switch (article.reviewDriveBy) {
		case 'author':
			if (userRole.right !== 'author') {
				throw new ApiError('INVITATION_REVIEW_FORBIDEN_OPERATION');
			}
			break;
		case 'editor':
			if (userRole.right !== 'editor') {
				throw new ApiError('INVITATION_REVIEW_FORBIDEN_OPERATION');
			}
			break;
		default:
			throw new ApiError('INVITATION_REVIEW_FORBIDEN_OPERATION');
	}
	serviceMail.sendEmail(
		'You have been invited to review an Article',
		emailInviteReviewer(article)
	);
	return article;
}

module.exports = inviteReviewer;
