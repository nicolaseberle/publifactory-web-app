const serviceRoleJournal = require('../journal/services');
const serviceRoleArticle = require('../article/services');

module.exports = {
	...serviceRoleJournal,
	...serviceRoleArticle
};
