const list = require('./list');
const create = require('./create');
const read = require('.read');
const update = require('./update');
const remove = require('./remove');
const addChild = require('./add-child')

module.exports = {
	list,
	create,
	read,
	update,
	remove,
	addChild
};
