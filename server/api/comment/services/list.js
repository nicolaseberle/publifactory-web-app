const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function list({ articleId }) {
	const article = await Article.findById(articleId).populate({
		path: 'partialReviews',
		populate: {
			path: 'child userId'
		}
	});
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	return article.partialReviews;
}

module.exports = list;
