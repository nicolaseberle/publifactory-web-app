const Article = require('../../article/article.model');
const Journal = require('../../journal/journal.model');
const { ApiError } = require('../../../config/error');
const isAuthorLead = require('./is-author-lead');

async function submitToCollection({ articleId, userId, journalId }) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (
		article.status !== 'preprint'
		//&& article.status !== 'draft') {
	) {
		throw new ApiError('ARTICLE_BAD_STATUS');
	}
	article.status = 'submit';
	const journal = await Journal.findById(journalId);
	if (!journal) throw new ApiError('JOURNAL_NOT_FOUND');
	const isLead = isAuthorLead(userId, article);
	if (!isLead) {
		throw new ApiError('AUTHOR_NOT_LEAD');
	}
	journal.content.push({
		published: false,
		reference: articleId
	});
	await article.save();
	await journal.save();
	return article;
}

module.exports = submitToCollection;
