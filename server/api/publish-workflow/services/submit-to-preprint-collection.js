const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');
const getPreprintCollection = require('./get-preprint-collection');

async function submitToPreprintCollection(articleId) {
	const preprintCollection = await getPreprintCollection();
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	if (article.status !== 'draft') {
		throw new ApiError('ARTICLE_BAD_STATUS');
	}
	if (
		preprintCollection.content.find(
			article => article.reference.toString() === articleId
		)
	) {
		throw new ApiError('JOURNAL_ARTICLE_ALREADY_IN_COLLECTION');
	}
	preprintCollection.content.push({
		published: false,
		reference: articleId
	});
	article.status = 'preprint';
	article.reviewDriveBy = 'author';
	await article.save();
	await preprintCollection.save();
	return article;
}

module.exports = submitToPreprintCollection;
