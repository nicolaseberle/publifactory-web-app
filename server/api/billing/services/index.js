const create = require('./create');
const read = require('./read');
const update = require('./update');
const list = require('./list');
const stripe = require('./stripe');

module.exports = {
	create,
	read,
	update,
	list,
	...stripe
};
