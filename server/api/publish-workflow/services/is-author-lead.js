function isAuthorLead(userId, article) {
	return article.authors.reduce((acc, author) => {
		if (
			userId === author.author.toString() &&
			author.rank === 1 &&
			author.role === 'Lead'
		) {
			return true;
		}
		return acc;
	}, false);
}

module.exports = isAuthorLead;
