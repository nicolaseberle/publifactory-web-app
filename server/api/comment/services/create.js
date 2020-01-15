const Review = require('../model');
const Article = require('../../article/article.model');
const { ApiError } = require('../../../config/error');

async function create({ userId, articleId, review }) {
	const article = await Article.findById(articleId);
	if (!article) throw new ApiError('ARTICLE_NOT_FOUND');
	const newReview = new Review({
		userId,
		...review
	});
	await newReview.save();
	article.reviews.push(newReview._id);
	await article.save();
  await newReview.populate('userId').execPopulate();
	return newReview;
}

module.exports = create;
