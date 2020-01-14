const Article = require('../../article/article.model');
const Journal = require('../../journal/journal.model');
const Email = require('../../email/email.controller');
const {
	emailArticleSubmissionInvitationTemplate
} = require('../../../config/emailing');
const { ApiError } = require('../../../config/error');

async function inviteAuthorToSubmit({ articleId, userId, journalId }) {
	const article = await Article.findById(articleId)
		.populate('authors.author')
		.exec();
	const journal = await Journal.findById(journalId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	if (article.status !== 'preprint') throw new ApiError('ARTICLE_BAD_STATUS');
	const isUserEditor = journal.users.filter(user => user.toString() === userId);
	if (!isUserEditor) throw new ApiError('JOURNAL_FORBIDEN_INVITATION');
	const authorsEmail = article.authors.reduce((acc, author) => {
		return [...acc, author.author.email];
	}, []);
	const email = new Email(authorsEmail);
	email.sendInvitationToSubmitArticle(
		journal,
		emailArticleSubmissionInvitationTemplate(article, journal)
	);
	return { url: `/api/journals/submit/ask/${journal._id}/${article._id}/` };
}

module.exports = inviteAuthorToSubmit;
