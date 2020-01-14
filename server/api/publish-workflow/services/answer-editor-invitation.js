const Article = require('../../article/article.model');
const Journal = require('../../journal/journal.model');
const serviceRole = require('../../roles/services');
const { ApiError } = require('../../../config/error');
const isAuthorLead = require('./is-author-lead');
// const isAuthorLead = require('./is-author-lead');

async function answerEditorInvitation({
	articleId,
	userId,
	journalId,
	answer
}) {
	const article = await Article.findById(articleId);
	const journal = await Journal.findById(journalId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	if (article.status !== 'preprint') throw new ApiError('ARTICLE_BAD_STATUS');
	if (!isAuthorLead(userId, article)) {
		throw new ApiError('ARTICLE_FORBIDEN_OPERATION');
	}
	if (answer === 'accept') {
		article.status = 'review';
		if (!journal.content.find(article => article.reference === articleId)) {
			journal.content.push({
				published: false,
				reference: articleId
			});
		}
		const journalRoles = await serviceRole.journalGetRoles({
			journalId: journalId,
			right: 'editor'
		});
		journalRoles.map(
			async journal =>
				await serviceRole.articleAddRole(journal.id_user, articleId, 'editor')
		);
	}
	await article.save();
	await journal.save();
	return {};
}

module.exports = answerEditorInvitation;
