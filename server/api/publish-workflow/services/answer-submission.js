const Article = require('../../article/article.model');
const Journal = require('../../journal/journal.model');
const serviceRole = require('../../roles/services');
const { ApiError } = require('../../../config/error');
// const isAuthorLead = require('./is-author-lead');

async function answerSubmission({ articleId, userId, journalId, answer }) {
	const article = await Article.findById(articleId);
	const journal = await Journal.findById(journalId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	if (article.status !== 'submit') throw new ApiError('ARTICLE_BAD_STATUS');
	const userRole = await serviceRole.journalGetRole({
		journalId,
		userId,
		right: 'editor'
	});
	if (!userRole) throw new ApiError('JOURNAL_FORBIDEN_OPERATION');
	// accept => add article in journal(ifnot) && add role for this article
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
		article.reviewDriveBy = 'editor';
	} else {
		// reject => remove article from journal
		article.status = 'preprint';
		journal.content = journal.content.filter(
			journal => journal.reference !== journalId
		);
	}
	await article.save();
	await journal.save();
	return article;
}

module.exports = answerSubmission;
