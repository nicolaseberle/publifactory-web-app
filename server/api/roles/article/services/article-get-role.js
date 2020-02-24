const RoleArticle = require('../roles.article.model');

async function articleGetRole({
	articleId = undefined,
	right = undefined,
	userId = undefined
}) {
	const query = {};

	if (articleId) query.id_article = articleId;
	if (right) query.right = right;
	if (userId) query.id_user = userId;
	const articleRole = await RoleArticle.findOne(query);
	return articleRole;
}

module.exports = articleGetRole;
