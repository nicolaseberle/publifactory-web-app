const create = require('./service');
const update = require('./update');
const remove = require('./remove');
const read = require('./read');
const list = require('./list');
const remind = require('./remind');
const totalRequest = require('./totalRequest');

module.exports = {
	create,
	update,
	remove,
	read,
	list,
	remind,
	totalRequest
};
