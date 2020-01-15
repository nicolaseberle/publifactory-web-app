const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function list({ articleId }) {
	const article = await Article.findById(articleId).populate({
		path: 'reviews',
		populate: {
			path: 'child userId'
		}
	});
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	console.log(article.reviews);
	return article.reviews;
}

module.exports = list;
