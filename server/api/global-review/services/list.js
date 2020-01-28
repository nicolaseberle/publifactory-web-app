const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function list({ articleId }) {
	const article = await Article.findById(articleId).populate({
		path: 'globalReviews',
		populate: {
			path: 'user'
		}
	});
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	return article.globalReviews;
}

module.exports = list;
