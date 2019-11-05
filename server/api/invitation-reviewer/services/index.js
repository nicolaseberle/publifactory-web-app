const create = require('./create');
const readById = require('./readById');
const remove = require('./remove');
const readByTitle = require('./readByTitle');
const update = require('./update');
const list = require('./list');

module.exports = {
	create,
	readById,
	readByTitle,
	remove,
	update,
	list
};
