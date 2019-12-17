const RoleArticle = require('../roles.article.model');

async function articleAddRole(userId, articleId, right) {
	const roleArticle = new RoleArticle({
		id_user: userId,
		id_article: articleId,
		right
	});
	console.log('adding roles', roleArticle);
	await roleArticle.save();
}

module.exports = articleAddRole;
