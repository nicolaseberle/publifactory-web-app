const RoleArticle = require('../roles.article.model');

async function articleAddRole(userId, articleId, right) {
	const roleArticle = new RoleArticle({
		id_user: userId,
		id_article: articleId,
		right
	});
	await roleArticle.save();
	return roleArticle;
}

module.exports = articleAddRole;
