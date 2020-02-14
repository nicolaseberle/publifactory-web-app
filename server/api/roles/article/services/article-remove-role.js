const RoleArticle = require('../roles.article.model');

async function articleRemoveRole({
	userId = undefined,
	articleId = undefined,
	right = undefined
}) {
	const query = {};
	if (articleId) query.id_article = articleId;
	if (right) query.right = right;
	if (userId) query.id_user = userId;
	const removed = await RoleArticle.deleteMany(query);
	console.log(removed);
	return removed;
}

module.exports = articleRemoveRole;
